
== Introduction ==

In GPipe, you'll primarily work with these four types of data on the GPU:
* [http://hackage.haskell.org/packages/archive/GPipe/latest/doc/html/Graphics-GPipe-Stream-Primitive.html#t:PrimitiveStream <code>PrimitiveStream</code>] 
* [http://hackage.haskell.org/packages/archive/GPipe/latest/doc/html/Graphics-GPipe-Stream-Fragment.html#t:FragmentStream <code>FragmentStream</code>] 
* [http://hackage.haskell.org/packages/archive/GPipe/latest/doc/html/Graphics-GPipe-FrameBuffer.html#t:FrameBuffer <code>FrameBuffer</code>] 
* [http://hackage.haskell.org/packages/archive/GPipe/latest/doc/html/Graphics-GPipe-Texture.html <code>Texture</code>] 

Let's walk our way through an simple example as I explain how you work with these types. This example requires GPipe version 1.4.1 or later.
This page is formatted as a literate Haskell page, simply save it as &quot;<tt>box.lhs</tt>&quot; and then type 
<pre>
ghc --make –O box.lhs
box
</pre>
at the prompt to see a spinning box. You’ll also need an image named &quot;<tt>myPicture.jpg</tt>&quot; in the same directory (I used a picture of some wooden planks).

<haskell>

> module Main where
 
> import Graphics.GPipe
> import Graphics.GPipe.Texture.Load
> import qualified Data.Vec as Vec
> import Data.Vec.Nat
> import Data.Monoid
> import Data.IORef
> import Graphics.UI.GLUT
>     (Window,
>     mainLoop,
>     postRedisplay,
>     idleCallback,
>     getArgsAndInitialize,
>     ($=))

</haskell>

Besides [http://hackage.haskell.org/package/GPipe GPipe], this example also uses the [http://hackage.haskell.org/package/GPipe-TextureLoad GPipe-TextureLoad package] for loading textures from disc. [http://hackage.haskell.org/package/GLUT GLUT] is used in GPipe for window management and the main loop.

== Creating a window ==

We start by defining the <hask>main</hask> function.

<haskell>

> main :: IO ()
> main = do
>     getArgsAndInitialize
>     tex <- loadTexture RGB8 "myPicture.jpg"
>     angleRef <- newIORef 0.0
>     newWindow "Spinning box" (100:.100:.()) (800:.600:.()) (renderFrame tex angleRef) initWindow
>     mainLoop       

> renderFrame :: Texture2D RGBFormat -> IORef Float -> Vec2 Int -> IO (FrameBuffer RGBFormat () ())
> renderFrame tex angleRef size = do
>     angle <- readIORef angleRef
>     writeIORef angleRef ((angle + 0.005) `mod'` (2*pi))
>     return $ cubeFrameBuffer tex angle size

> initWindow :: Window -> IO ()
> initWindow win = idleCallback $= Just (postRedisplay (Just win))

</haskell>

First we set up GLUT, and load a texture from disc via the [http://hackage.haskell.org/package/GPipe-TextureLoad GPipe-TextureLoad package] function <hask>loadTexture</hask>. In this example we're going to animate a spinning box, and for that we put an angle in an <hask>IORef</hask> so that we can update it between frames. We then create a window with [http://hackage.haskell.org/packages/archive/GPipe/latest/doc/html/Graphics-GPipe-FrameBuffer.html#v:newWindow <code>newWindow</code>]. When the window is created, <hask>initWindow</hask> registers this window as being continously redisplayed in the idle loop. At each frame, the <hask>IO</hask> action <hask>renderFrame tex angleRef size</hask> is run. In this function the angle is incremented with 0.005 (reseted each lap), and a <hask>FrameBuffer</hask> is created and returned to be displayed in the window. But before I explain <hask>FrameBuffer</hask>s, let's jump to the start of the graphics pipeline instead.


== PrimitiveStreams ==

The graphics pipeline starts with creating primitives such as triangles on the GPU.Let's create a box with six sides, each made up of two triangles each.

<haskell>

> cube :: PrimitiveStream Triangle (Vec3 (Vertex Float), Vec3 (Vertex Float), Vec2 (Vertex Float))
> cube = mconcat [sidePosX, sideNegX, sidePosY, sideNegY, sidePosZ, sideNegZ]
 
> sidePosX = toGPUStream TriangleStrip $ zip3 [1:.0:.0:.(), 1:.1:.0:.(), 1:.0:.1:.(), 1:.1:.1:.()] (repeat (1:.0:.0:.()))    uvCoords
> sideNegX = toGPUStream TriangleStrip $ zip3 [0:.0:.1:.(), 0:.1:.1:.(), 0:.0:.0:.(), 0:.1:.0:.()] (repeat ((-1):.0:.0:.())) uvCoords
> sidePosY = toGPUStream TriangleStrip $ zip3 [0:.1:.1:.(), 1:.1:.1:.(), 0:.1:.0:.(), 1:.1:.0:.()] (repeat (0:.1:.0:.()))    uvCoords
> sideNegY = toGPUStream TriangleStrip $ zip3 [0:.0:.0:.(), 1:.0:.0:.(), 0:.0:.1:.(), 1:.0:.1:.()] (repeat (0:.(-1):.0:.())) uvCoords
> sidePosZ = toGPUStream TriangleStrip $ zip3 [1:.0:.1:.(), 1:.1:.1:.(), 0:.0:.1:.(), 0:.1:.1:.()] (repeat (0:.0:.1:.()))    uvCoords
> sideNegZ = toGPUStream TriangleStrip $ zip3 [0:.0:.0:.(), 0:.1:.0:.(), 1:.0:.0:.(), 1:.1:.0:.()] (repeat (0:.0:.(-1):.())) uvCoords

> uvCoords = [0:.0:.(), 0:.1:.(), 1:.0:.(), 1:.1:.()]

</haskell> 

Every side of the box is created from a regular list of four elements each, where each element is a tuple with three vectors: a position, a normal and an uv-coordinate. These lists of vertices are then turned into [http://hackage.haskell.org/packages/archive/GPipe/latest/doc/html/Graphics-GPipe-Stream-Primitive.html#t:PrimitiveStream <code>PrimitiveStream</code>]s on the GPU by [http://hackage.haskell.org/packages/archive/GPipe/latest/doc/html/Graphics-GPipe-Stream-Primitive.html#v:toGPUStream <code>toGPUStream</code>] that in our case creates triangle strips from the vertices, i.e 2 triangles from 4 vertices. Refer to the OpenGl specification on how triangle strips and the other topologies works.

All six sides are then concatenated together into a cube. We can see that the type of the cube is a <hask>PrimitiveStream</hask> of [http://hackage.haskell.org/packages/archive/GPipe/latest/doc/html/Graphics-GPipe-Stream-Primitive.html#t:Triangle <code>Triangle</code>]s where each vertex is a tuple of three vectors, just as the lists we started with. One big difference is that those vectors now are made up of <hask>Vertex Float</hask>s instead of <hask>Float</hask>s since they are now on the GPU.

The cube is defined in model-space, i.e where positions and normals are relative the cube. We now want to rotate that cube using a variable angle and project the whole thing with a perspective projection, as it is seen through a camera 2 units down the z-axis. 

<haskell>

> transformedCube :: Float -> Vec2 Int -> PrimitiveStream Triangle (Vec4 (Vertex Float), (Vec3 (Vertex Float), Vec2 (Vertex Float)))
> transformedCube angle size = fmap (transform angle size) cube

> transform angle (width:.height:.()) (pos, norm, uv) = (transformedPos, (transformedNorm, uv))
>     where
>         modelMat = rotationVec (normalize (1:.0.5:.0.3:.())) angle `multmm` translation (-0.5)
>         viewMat = translation (-(0:.0:.2:.())) 
>         projMat = perspective 1 100 (pi/3) (fromIntegral width / fromIntegral height)
>         viewProjMat = projMat `multmm` viewMat
>         transformedPos = toGPU (viewProjMat `multmm` modelMat) `multmv` (homPoint pos :: Vec4 (Vertex Float))
>         transformedNorm = toGPU (Vec.map (Vec.take n3) $ Vec.take n3 modelMat) `multmv` norm

</haskell>

When applying a function on the <hask>PrimitiveStream</hask> using <hask>fmap</hask>, that function will be executed on the GPU using vertex shaders. The [http://hackage.haskell.org/packages/archive/GPipe/latest/doc/html/Graphics-GPipe-Stream.html#v:toGPU <code>toGPU</code>] function transforms normal values like <hask>Float</hask>s into GPU-values like <hask>Vertex Float</hask> so it can be used with the vertices of the <hask>PrimitiveStream</hask>.


== FragmentStreams ==

To render the primitives on the screen, we must first turn them into pixel fragments. This is called rasterization and in our example done by the function [http://hackage.haskell.org/packages/archive/GPipe/latest/doc/html/Graphics-GPipe-Stream-Fragment.html#v:rasterizeFront <code>rasterizeFront</code>], which transforms <hask>PrimitiveStream</hask>s into [http://hackage.haskell.org/packages/archive/GPipe/latest/doc/html/Graphics-GPipe-Stream-Fragment.html#t:FragmentStream <code>FragmentStream</code>]s.

<haskell>

> rasterizedCube :: Float -> Vec2 Int -> FragmentStream (Vec3 (Fragment Float), Vec2 (Fragment Float))
> rasterizedCube angle size = rasterizeFront $ transformedCube angle size

</haskell>

In the rasterization process, values of type <hask>Vertex Float</hask> are turned into values of type <hask>Fragment Float</hask>.

For each fragment, we now want to give it a color from the texture we initially loaded, as well as light it with a directional light coming from the camera.

<haskell>
	
> litCube :: Texture2D RGBFormat -> Float -> Vec2 Int -> FragmentStream (Color RGBFormat (Fragment Float))
> litCube tex angle size = fmap (enlight tex) $ rasterizedCube angle size

> enlight tex (norm, uv) = RGB (c * Vec.vec (norm `dot` toGPU (0:.0:.1:.())))
>     where RGB c = sample (Sampler Linear Wrap) tex uv

</haskell>

Using <hask>fmap</hask> on a <hask>FragmentStream</hask> will execute a function on the GPU using fragment shaders. The function [http://hackage.haskell.org/packages/archive/GPipe/1.1.3/doc/html/Graphics-GPipe-Texture.html#v:sample <code>sample</code>] is used for sampling the texture we have loaded, using the fragment's interpolated uv-coordinates and a sampler state.

Once we have a <hask>FragmentStream</hask> of <hask>Color</hask>s, we can paint those fragments onto a <hask>FrameBuffer</hask>.

== FrameBuffers ==

A [http://hackage.haskell.org/packages/archive/GPipe/latest/doc/html/Graphics-GPipe-FrameBuffer.html#t:FrameBuffer <code>FrameBuffer</code>] is a 2D image in which fragments from <hask>FragmentStream</hask>s are painted. A <hask>FrameBuffer</hask> may contain any combination of a color buffer, a depth buffer and a stencil buffer. Besides being shown in windows, <hask>FrameBuffer</hask>s may also be saved to memory or converted to textures, thus enabling multi pass rendering. A <hask>FrameBuffer</hask> has no defined size, but take the size of the window when shown, or are given a size when saved to memory or converted to a texture.  

And so finally, we paint the fragments we have created onto a black <hask>FrameBuffer</hask>. By this we use [http://hackage.haskell.org/packages/archive/GPipe/latest/doc/html/Graphics-GPipe-FrameBuffer.html#v:paintColor <code>paintColor</code>] without any blending or color masking.

<haskell>

> cubeFrameBuffer :: Texture2D RGBFormat -> Float -> Vec2 Int -> FrameBuffer RGBFormat () ()
> cubeFrameBuffer tex angle size = paintSolid (litCube tex angle size) emptyFrameBuffer

> paintSolid = paintColor NoBlending (RGB $ Vec.vec True)
> emptyFrameBuffer = newFrameBufferColor (RGB 0)

</haskell>

This <hask>FrameBuffer</hask> is the one we return from the <hask>renderFrame</hask> action we defined at the top.


== Screenshot ==

[[Image:box.jpg]]


[[Category:Tutorials]]
