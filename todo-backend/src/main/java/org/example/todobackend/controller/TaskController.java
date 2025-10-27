package org.example.todobackend.controller;

import jakarta.validation.Valid;
import org.example.todobackend.dto.TaskRequest;
import org.example.todobackend.dto.TaskResponse;
import org.example.todobackend.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping
    public List<TaskResponse> list(@RequestParam(defaultValue = "5") int limit) {
        return service.listRecentIncomplete(limit).stream().map(TaskResponse::from).toList();
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskRequest req) {
        var task = service.create(req.title(), req.description());
        return ResponseEntity
                .created(URI.create("/api/tasks/" + task.getId()))
                .body(TaskResponse.from(task));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Void> complete(@PathVariable long id) {
        service.complete(id);
        return ResponseEntity.noContent().build();
    }
}

