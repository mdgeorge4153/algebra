Require Import
  Coq.setoid_ring.Ring Coq.setoid_ring.Field
  MathClasses.interfaces.abstract_algebra 
  MathClasses.theory.rings MathClasses.theory.dec_fields
  MathClasses.interfaces.orders MathClasses.orders.semirings MathClasses.orders.rings.

Inductive AdjoinRoot R (n : R) : Type := adjoin
  { ones  : R
  ; roots : R
  }.

Arguments adjoin {R n} _ _.
Arguments ones {R n} _.
Arguments roots {R n} _.

(******************************************************************************)
Section ring.

Context `{Ring R} `{n : R}.

Global Instance Adjoin_equiv : Equiv (AdjoinRoot R n) :=
  λ (x : AdjoinRoot R n) (y : AdjoinRoot R n), ones x = ones y /\ roots x = roots y.

Global Instance Adjoin_plus  : Plus (AdjoinRoot R n) :=
  λ x y,adjoin (ones x + ones y) (roots x + roots y).

Global Instance Adjoin_zero  : Zero (AdjoinRoot R n) :=
  adjoin 0 0.

Global Instance Adjoin_one : One (AdjoinRoot R n) :=
  adjoin 1 0.

Global Instance Adjoin_mult : Mult (AdjoinRoot R n) :=
  λ x y,adjoin (ones x * ones y + n * roots x * roots y) (ones x * roots y + roots x * ones y).

Global Instance Adjoin_negate : Negate (AdjoinRoot R n) :=
  λ x,adjoin (negate (ones x)) (negate (roots x)).

Global Instance: Setoid (AdjoinRoot R n).
Proof.  firstorder. Qed.

Add Ring R : (stdlib_ring_theory R).

Ltac unfolds := unfold Adjoin_negate, Adjoin_plus, Adjoin_mult, Adjoin_equiv in *; simpl in *.
Ltac ring_on_ring := repeat intro; unfolds; try ring.

Global Instance: Ring (AdjoinRoot R n).
Proof.
repeat (split; try apply _); unfolds; ring_on_ring; repeat (apply sg_op_proper); firstorder.
Qed.

Definition from_r (r : R) : AdjoinRoot R n :=
  adjoin r zero.

Global Instance: SemiRing_Morphism from_r.
Proof.
repeat (split; try apply _); simpl; try ring_simplify; firstorder.
Qed.

Global Instance: Injective from_r.
Proof.  firstorder. Qed.

Global Instance roots_mor : @SemiGroup_Morphism _ _ _ _ (+) (+) (@roots R n).
Proof. repeat (split; try apply _); firstorder. Qed.

Global Instance ones_mor : @SemiGroup_Morphism _ _ _ _ (+) (+) (@ones R n).
Proof. repeat (split; try apply _); firstorder. Qed.

End ring.

(******************************************************************************)
Section decfield.

Context `{DecField F} `{n : F} {n_nonsquare : ∀ k, k * k ≠ n}.
Add Field F : (stdlib_field_theory F).

Global Instance Adjoin_apart: Apart (AdjoinRoot F n) := (≠).
Instance: TrivialApart (AdjoinRoot F n).
Proof. firstorder. Qed.

Global Instance Adjoin_recip: DecRecip (AdjoinRoot F n) :=
  λ (x : AdjoinRoot F n), 
    let den := x.(ones) * x.(ones) - x.(roots) * x.(roots) * n in
    adjoin (x.(ones) / den) (-x.(roots) / den).

Ltac unfolds := unfold equiv, Adjoin_negate, Adjoin_plus, Adjoin_mult, dec_recip, Adjoin_recip in *; simpl in *.

Context `{∀ (x y : F), Decision (x = y)}.

Lemma conj_norm_nonzero: forall (x : AdjoinRoot F n),
  x ≠ 0 -> ones x * ones x - roots x * roots x * n ≠ 0.
Proof.
intros x x_nonzero.
unfold not. intro eqn.

(* rearrange eqn from assumption *)
rewrite <- right_inverse in eqn; apply right_cancellation in eqn; try (apply _).

destruct (decide (roots x = 0)); match goal with
  | [ roots_zero : roots x = 0 |- _ ] => apply x_nonzero; rewrite roots_zero in eqn; field_simplify in eqn; apply zero_product in eqn; destruct eqn; repeat red; auto
  | [ H : roots x ≠ 0 |- _ ] => apply (n_nonsquare (ones x / roots x)); field_simplify; auto; rewrite eqn; field; auto
end.

Qed.

Global Instance: DecField (AdjoinRoot F n).
Proof.
repeat (split; try apply _);
  match goal with
    | [ |- PropHolds (1 ≠ 0) ]   => repeat red; unfolds; intro one_eq_zero; destruct one_eq_zero; simpl in *; destruct H; auto (* TODO: remove dependence on "H" *)
    | [ H : ?x = ?y |- _ (/ ?x) = _ (/ ?y) ] => simpl; rewrite H; auto
    | [ |- _ (/ 0) = _ 0 ]     => simpl; ring
    | [ |- _ (?x / ?x) = _ 1 ] => simpl; field; apply conj_norm_nonzero; auto
    | [ |- _ ] => try ring
  end.
Qed.

End decfield.

(******************************************************************************)
Section orders.

Context `{Ring OR} `{!SemiRingOrder Rle} `{n : OR} `{n_nonneg : 0 ≤ n}.

Add Ring OR : (stdlib_ring_theory OR).
Add Ring AR : (stdlib_ring_theory (AdjoinRoot OR n)).

Definition nonneg (x : AdjoinRoot OR n) : Prop :=
  (*
    a + b√n ≥ 0 iff a ≥ -b√n
     - if a is zero, this is same as b ≥ 0
     - if a pos, we can multiply both sides by 
  *)
  let a := ones x in
  let b := roots x in
  (0 ≤ a /\ 0 ≤ b)
  \/
  (0 ≤ a /\ b * b ≤ n * a * a)
  \/
  (0 ≤ b /\ n * a * a ≤ b * b).

Global Instance Adjoin_le : Le (AdjoinRoot OR n) :=
  λ x y,nonneg (y - x).

Ltac unfolds := unfold le, Adjoin_le, nonneg, Adjoin_negate, Adjoin_plus, Adjoin_mult, dec_recip, Adjoin_recip in *; simpl in *.

Instance: Proper ((=) ==> (=) ==> iff) Adjoin_le.
Proof.
repeat red; intros; unfolds; rewrite <- H0; rewrite <- H1; auto.
Qed.

Instance: Reflexive Adjoin_le.
Proof.
repeat red; intro x; left; split; ring_simplify (x - x); firstorder.
Qed.

Instance: Transitive Adjoin_le.
Proof.
repeat red.

Instance: AntiSymmetric Adjoin_le.

Instance: SemiRingOrder Adjoin_le.
Proof.
split.
  split; auto. apply _. apply _. split. apply _.
repeat split

End.

(******************************************************************************)
Notation "( a √ 1 + b √ n )" := (@adjoin _ n a b) : mc_scope.

Require Import MathClasses.implementations.peano_naturals.
Eval compute in (adjoin 4 3) * (adjoin 0 1) %nat : AdjoinRoot nat 2.
Eval compute in (4√1 + 3√2) * (6√1 + 2√2) %nat .
Eval compute in / (4√1 + 3√2) %nat.

