package org.example.todobackend.dto;

import org.example.todobackend.entity.Task;

public record TaskResponse(
        Long id,
        String title,
        String description,
        String createdAt,
        boolean completed
) {
    public static TaskResponse from(Task t) {
        return new TaskResponse(
                t.getId(),
                t.getTitle(),
                t.getDescription(),
                t.getCreatedAt().toString(),
                t.isCompleted()
        );
    }
}

