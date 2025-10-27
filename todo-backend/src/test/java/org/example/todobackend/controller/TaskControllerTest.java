package org.example.todobackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.todobackend.dto.TaskRequest;
import org.example.todobackend.entity.Task;
import org.example.todobackend.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;

    @MockBean TaskService service;

    @Test
    void list_returnsTaskResponses() throws Exception {
        var t1 = task(1L, "A"); var t2 = task(2L, "B");
        given(service.listRecentIncomplete(5)).willReturn(List.of(t1, t2));

        mvc.perform(get("/api/tasks").param("limit", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("A"));
    }

    @Test
    void create_valid_returns201WithBody() throws Exception {
        var req = new TaskRequest("Buy", "Milk");
        var saved = task(42L, "Buy");
        given(service.create(anyString(), anyString())).willReturn(saved);

        mvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsBytes(req)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/tasks/42"))
                .andExpect(jsonPath("$.id").value(42))
                .andExpect(jsonPath("$.title").value("Buy"))
                .andExpect(jsonPath("$.completed").value(false));
    }

    @Test
    void complete_returns204() throws Exception {
        mvc.perform(patch("/api/tasks/{id}/complete", 7))
                .andExpect(status().isNoContent());
    }

    private Task task(Long id, String title) {
        var t = new Task();
        t.setTitle(title);
        t.setDescription("d");
        t.setCompleted(false);
        t.setCreatedAt(Instant.now());
        try {
            var f = Task.class.getDeclaredField("id");
            f.setAccessible(true);
            f.set(t, id);
        } catch (Exception ignored) {}
        return t;
    }
}


