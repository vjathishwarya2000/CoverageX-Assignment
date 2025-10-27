package org.example.todobackend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.todobackend.dto.TaskRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TodoApplicationTest {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;

    @Test
    void flow_add6_list5_completeOne_listStill5() throws Exception {
        long lastId = -1;
        for (int i = 1; i <= 6; i++) {
            var res = mvc.perform(post("/api/tasks")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(om.writeValueAsBytes(new TaskRequest("T" + i, "d"))))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").exists())
                    .andReturn();
            lastId = om.readTree(res.getResponse().getContentAsByteArray()).get("id").asLong();
        }

        mvc.perform(get("/api/tasks").param("limit", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(5)));

        mvc.perform(patch("/api/tasks/{id}/complete", lastId))
                .andExpect(status().isNoContent());

        mvc.perform(get("/api/tasks").param("limit", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(5)))
                .andExpect(jsonPath("$[*].completed", everyItem(is(false))));
    }
}


