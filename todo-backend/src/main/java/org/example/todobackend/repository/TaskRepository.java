package org.example.todobackend.repository;

import org.example.todobackend.entity.Task;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCompletedFalseOrderByCreatedAtDesc(Pageable pageable);
}

