Generalizable Variable A.

Require Import Coq.Classes.Morphisms Coq.Relations.Relations.
Require Import Coq.Unicode.Utf8 Coq.Unicode.Utf8_core.
Require Import Coq.Arith.PeanoNat.

(* Operational Typeclasses and notations *)

Declare Scope mc_scope.
Open Scope mc_scope.

Class Equiv A    := equiv : relation A.
Infix    "="     := equiv : type_scope.
Notation "( = )" := equiv (only parsing) : mc_scope.

Class SemiGroupOp A := sg_op : A -> A -> A.
Infix    "&"        := sg_op (at level 50, left associativity) : mc_scope.
Notation "( & )"    := sg_op : mc_scope.

Class UnitOp A := unit : A.

Class InverseOp A := inv_op : A -> A.
Notation "x ⁻¹"   := (inv_op x) (at level 30) : mc_scope.
Notation "( ⁻¹ )" := inv_op : mc_scope.

Class ZeroOp A := zero : A.
Notation "0" := zero : mc_scope.

Class OneOp A  := one  : A.
Notation "1" := one  : mc_scope.

Class NegOp A     := neg_op  : A -> A.
Notation  "- x"   := (neg_op x) : mc_scope.
Notation  "( - )" := neg_op (only parsing) : mc_scope.
Notation  "x - y" := (x + -y) : mc_scope.

Class PlusOp A      := plus_op : A -> A -> A.
Infix "+"           := plus_op : mc_scope.
Notation "( + )"    := plus_op (only parsing) : mc_scope.
Notation "( x + )"  := (plus_op x) (only parsing) : mc_scope.
Notation "( + x )"  := (λ y,y + x) (only parsing) : mc_scope.

Class TimesOp A B C := times_op : A -> B -> C.
Infix "*"        := times_op : mc_scope.
Notation "( * )" := times_op (only parsing) : mc_scope.
Notation "( x * )" := (times_op x) (only parsing) : mc_scope.
Notation "( * x )" := (λ y, y * x) (only parsing) : mc_scope.

(* Instances *)

Instance plus_is_sg_op `{f : PlusOp A} : SemiGroupOp A := f.
Instance zero_is_unit  `{e : ZeroOp A} : UnitOp A      := e.
Instance one_is_unit   `{e : OneOp  A} : UnitOp A      := e.
Instance neg_is_inv_op `{n : NegOp  A} : InverseOp A   := n.
Instance times_is_sg_op `{f : TimesOp A A A} : SemiGroupOp A := f.

(* General properties *)

(* From Coq.Classes:
    - Class Symmetric
    - Class Reflexive
    - Class Transitive
    - Class Equivalence
*)

Section Properties.

Context {A} {Ae : Equiv A}.

Class Associative (f : A -> A -> A) : Prop :=
    associativity : forall (x y z : A), f x (f y z) = f (f x y) z.

Class Commutative (f : A -> A -> A) : Prop :=
    commutativity : forall (x y : A), f x y = f y x.

Class LeftIdentity (f : A -> A -> A) (e : A) : Prop :=
    left_identity : forall x : A, f e x = x.

Class RightIdentity (f : A -> A -> A) (e : A) : Prop :=
    right_identity : forall x : A, f x e = x.

Class Identity (f : A -> A -> A) (e : A) : Prop :=
    { identity_is_left_identity  :> LeftIdentity  f e
    ; identity_is_right_identity :> RightIdentity f e
    }.

Class LeftInverse (op : A -> A -> A) (inv : A -> A) (unit : A) :=
    left_inverse : forall x : A, op (inv x) x = unit.

Class RightInverse (op : A -> A -> A) (inv : A -> A) (unit : A) :=
    right_inverse : forall x : A, op x (inv x) = unit.

Class Inverse (op : A -> A -> A) (inv : A -> A) (unit : A) :=
    { inv_is_left_inverse  : LeftInverse op inv unit
    ; inv_is_right_inverse : RightInverse op inv unit
    }.

Class DistributesOver (f : A -> A -> A) (g : A -> A -> A) : Prop :=
    distributivity : forall (x y z: A), f x (g y z) = g (f x y) (f x z).

End Properties.

(* Algebraic hierarchy *)

Section Algebra.

Context A {Ae : Equiv A}.

Class Setoid : Prop := setoid_eq_is_equiv : Equivalence Ae.

Section Groups.

Context {Aop : SemiGroupOp A}.

Class SemiGroup : Prop :=
    { sg_setoid :> Setoid
    ; sg_ass    :> Associative (&)
    ; sg_op_proper : Proper ((=) ==> (=) ==> (=)) (&)
    }.

Context {Au : UnitOp A}.

Class Monoid : Prop :=
    { mon_semigroup :> SemiGroup
    ; mon_identity  :> Identity (&) unit
    }.

Context {Ainv : InverseOp A}.

Class Group : Prop :=
    { gp_monoid  :> SemiGroup
    ; g_inverse  :> Inverse  (&) (⁻¹) unit
    ; inv_proper :> Proper ((=) ==> (=)) (⁻¹)
    }.

End Groups.

Section Rings.

Context {Aplus : PlusOp A} {Aneg : NegOp A} {Azero : ZeroOp A}.

Class AbGroup : Prop :=
    { ab_group       :> @Group plus_is_sg_op zero_is_unit neg_is_inv_op
    ; ab_commutative :> Commutative (+)
    }.

Context {Atimes : TimesOp A A A} {Aone : OneOp A}.

Class Ring : Prop :=
    { r_abelian_group         :> AbGroup
    ; r_multiplicative_monoid :> @Monoid times_is_sg_op one_is_unit
    ; r_distributive          :> DistributesOver ( * ) (+)
    }.

Class CommRing : Prop :=
    { cr_ring :> Ring
    ; cr_commutative :> Commutative ( * )
    }.

Definition is_unit (x : A) : Prop := exists (y : A), x * y = 1.

Definition is_zero_divisor (x : A) : Prop :=
  ~ (x = 0) /\ exists (y : A), x * y = 0.

Class IntegralDomain : Prop :=
    { dom_ring :> CommRing
    ; dom_no_zero_divisors : forall (x : A), ~ (is_zero_divisor x)
    }.

Class Field : Prop :=
    { field_ring :> CommRing
    ; field_all_units : forall (x : A), is_unit x \/ x = 0
    }.

End Rings.

Section Modules.

Context S {SEq : Equiv S} .

End Modules.

End Algebra.

Instance nat_equiv : Equiv nat := eq.
Instance plus_sgop : SemiGroupOp nat := Peano.plus.

Instance nat_plus_assoc : Associative Peano.plus := Nat.add_assoc.

Instance sg_nat : SemiGroup nat.
Proof.
    repeat split; try apply _.
Qed.


