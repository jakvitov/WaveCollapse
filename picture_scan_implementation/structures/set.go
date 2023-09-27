package structures

// A Set structure (There is not in std. lib.)
type Set[T comparable] struct {
	data map[T]bool
}

func CreateSet[T comparable]() *Set[T] {
	return &Set[T]{}
}

func (s *Set[T]) Add(val T) {
	if s.data == nil {
		s.data = make(map[T]bool)
	}
	s.data[val] = true
}

// Merge the given set into s
func (s *Set[T]) mergeSet(toMerge *Set[T]) {
	for val := range toMerge.data {
		s.Add(val)
	}
}

func (s *Set[T]) Remove(val T) {
	if s.data == nil {
		s.data = make(map[T]bool)
	}
	delete(s.data, val)
}

func (s *Set[T]) Length() int {
	return len(s.data)
}

func (s *Set[T]) IsPresent(val T) bool {
	_, ok := s.data[val]
	return ok
}

// Return a new map, that contains all items, that are in the given map, but not in the set
func RestrictMapWithSet[T comparable, K any](inputMap map[T]K, inputSet *Set[T]) map[T]K {
	result := make(map[T]K)
	for key := range inputMap {
		if !inputSet.IsPresent(key) {
			result[key] = inputMap[key]
		}
	}
	return result
}
