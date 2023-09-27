package structures

// Implementation of queue for pixel processing
type Queue[T comparable] struct {
	data []T
	//We keep count of the recent dequeues, to recopy the data to save memory
	deqCount int
}

func CreateQueue[T comparable]() *Queue[T] {
	result := &Queue[T]{}
	//We set initial capacity to 100
	result.data = make([]T, 0, 100)
	result.deqCount = 0
	return result
}

func (q *Queue[T]) Enqueue(obj T) {
	q.data = append(q.data, obj)
}

func (q *Queue[T]) Dequeue() T {
	result := q.data[q.deqCount]

	//We dequeued half the array -> we create new one and copy it for space efficiency
	if (len(q.data) / q.deqCount) > 2 {
		newData := make([]T, 0, len(q.data)-q.deqCount)
		for i := q.deqCount; i < len(q.data); i++ {
			newData[i-q.deqCount] = q.data[i]
		}
		q.deqCount = 0
		q.data = newData
	}

	return result
}

func (q *Queue[T]) IsEmpty() bool {
	return q.deqCount == len(q.data)
}
