(* This is an implementation of numbers of the form a + sqrt(n) as a ring and field for mathclasses *)

Require Import 
  Coq.setoid_ring.Ring Coq.setoid_ring.Field
  MathClasses.interfaces.abstract_algebra 
  MathClasses.theory.rings MathClasses.theory.dec_fields.

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

(*
Require Import Coq.Bool.Sumbool.
Instance and_dec `{Decision P} `{Decision Q} : Decision (P /\ Q).
refine (
  if (decide P)
  then
    if (decide Q) then left _ _ else right _ _
  else right _ _); tauto.
Defined.
*)

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

End ring.

(******************************************************************************)
Section field.

Context `{DecField F} `{n : F} {n_nonsquare : ∀ k, k * k ≠ n}.

Instance Adjoin_apart: Apart (AdjoinRoot F n) := (≠).
Instance: TrivialApart (AdjoinRoot F n).
Proof. firstorder. Qed.

Instance Adjoin_recip: DecRecip (AdjoinRoot F n) :=
  λ (x : AdjoinRoot F n), 
    let den := x.(ones) * x.(ones) - x.(roots) * x.(roots) * n in
    adjoin (x.(ones) / den) (-x.(roots) / den).

Add Field F : (stdlib_field_theory F).

Instance roots_mor : Setoid_Morphism (@roots F n).
Proof. split; try (apply _); repeat red; intros; firstorder. Qed.

Instance ones_mor : Setoid_Morphism (@ones F n).
Proof. split; try (apply _); repeat red; intros; firstorder. Qed.

Ltac unfolds := unfold equiv, Adjoin_negate, Adjoin_plus, Adjoin_mult, dec_recip, Adjoin_recip in *; simpl in *.

(*
Lemma inv_unique: forall (x y : F), x - y = 0 -> x = y.
Proof. 
*)

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

Instance: DecField (AdjoinRoot F n).
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

