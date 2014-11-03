module Paths_tangy (
    version,
    getBinDir, getLibDir, getDataDir, getLibexecDir,
    getDataFileName
  ) where

import qualified Control.Exception as Exception
import Data.Version (Version(..))
import System.Environment (getEnv)
import Prelude

catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
catchIO = Exception.catch


version :: Version
version = Version {versionBranch = [0,0], versionTags = []}
bindir, libdir, datadir, libexecdir :: FilePath

bindir     = "/home/mdgeorge/.cabal/bin"
libdir     = "/home/mdgeorge/.cabal/lib/tangy-0.0/ghc-7.6.3"
datadir    = "/home/mdgeorge/.cabal/share/tangy-0.0"
libexecdir = "/home/mdgeorge/.cabal/libexec"

getBinDir, getLibDir, getDataDir, getLibexecDir :: IO FilePath
getBinDir = catchIO (getEnv "tangy_bindir") (\_ -> return bindir)
getLibDir = catchIO (getEnv "tangy_libdir") (\_ -> return libdir)
getDataDir = catchIO (getEnv "tangy_datadir") (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "tangy_libexecdir") (\_ -> return libexecdir)

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir ++ "/" ++ name)
