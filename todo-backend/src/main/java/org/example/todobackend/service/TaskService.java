package org.example.todobackend.service;

import org.example.todobackend.entity.Task;
import org.example.todobackend.repository.TaskRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Service
public class TaskService {
    private final TaskRepository repo;

    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }

    public List<Task> listRecentIncomplete(int limit) {
        int size = Math.max(1, Math.min(limit, 50));
        return repo.findByCompletedFalseOrderByCreatedAtDesc(PageRequest.of(0, size));
    }

    @Transactional
    public Task create(String title, String description) {
        Task t = new Task();
        t.setTitle(title);
        t.setDescription(description == null ? "" : description);
        return repo.save(t);
    }

    @Transactional
    public void complete(long id) {
        Task t = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Task not found"));
        if (!t.isCompleted()) {
            t.setCompleted(true);
            repo.save(t);
        }
    }
}

