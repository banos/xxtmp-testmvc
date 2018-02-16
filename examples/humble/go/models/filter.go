package models

// Predicate is a function which takes a tobuy and returns a bool. It can be
// used in filters.
type Predicate func(*Tobuy) bool

// Predicates is a data structure with commonly used Predicates.
var Predicates = struct {
	All       Predicate
	Completed Predicate
	Remaining Predicate
}{
	All:       func(_ *Tobuy) bool { return true },
	Completed: (*Tobuy).Completed,
	Remaining: (*Tobuy).Remaining,
}

// All returns all the tobuys. It applies a filter using the All predicate.
func (list TobuyList) All() []*Tobuy {
	return list.Filter(Predicates.All)
}

// Completed returns only those tobuys which are completed. It applies a filter
// using the Completed predicate.
func (list TobuyList) Completed() []*Tobuy {
	return list.Filter(Predicates.Completed)
}

// Remaining returns only those tobuys which are remaining (or active). It
// applies a filter using the Remaining predicate.
func (list TobuyList) Remaining() []*Tobuy {
	return list.Filter(Predicates.Remaining)
}

// Filter returns a slice tobuys for which the predicate is true. The returned
// slice is a subset of all tobuys.
func (list TobuyList) Filter(f Predicate) []*Tobuy {
	results := []*Tobuy{}
	for _, tobuy := range list.tobuys {
		if f(tobuy) {
			results = append(results, tobuy)
		}
	}
	return results
}

// Invert inverts a predicate, i.e. a function which accepts a tobuy as an
// argument and returns a bool. It returns the inverted predicate. Where f would
// return true, the inverted predicate would return false and vice versa.
func invert(f Predicate) Predicate {
	return func(tobuy *Tobuy) bool {
		return !f(tobuy)
	}
}

// tobuyById returns a predicate which is true iff tobuy.id equals the given
// id.
func tobuyById(id string) Predicate {
	return func(t *Tobuy) bool {
		return t.id == id
	}
}

// tobuyNotById returns a predicate which is true iff tobuy.id does not equal
// the given id.
func tobuyNotById(id string) Predicate {
	return invert(tobuyById(id))
}
