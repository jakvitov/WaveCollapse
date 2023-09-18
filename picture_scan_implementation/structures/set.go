package structures

// A Set structure (There is not in std. lib.)
type Set[T comparable] struct {
	data map[T]bool
}

func (s Set[T]) Add(val T) {
	if s.data == nil {
		s.data = make(map[T]bool)
	}
	s.data[val] = true
}

func (s Set[T]) Remove(val T) {
	if s.data == nil {
		s.data = make(map[T]bool)
	}
	delete(s.data, val)
}
