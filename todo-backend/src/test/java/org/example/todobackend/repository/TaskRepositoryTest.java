package org.example.todobackend.repository;

import org.example.todobackend.entity.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.data.domain.PageRequest;

import java.time.Instant;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class TaskRepositoryTest {

    @Autowired
    private TaskRepository repo;

    @BeforeEach
    void clean() {
        repo.deleteAll();
    }

    @Test
    void findByCompletedFalseOrderByCreatedAtDesc_pagesAndFilters() {
        // seed 10 tasks, mark 3 completed
        IntStream.rangeClosed(1, 10).forEach(i -> {
            Task t = new Task();
            t.setTitle("T" + i);
            t.setDescription("d");
            t.setCompleted(i % 3 == 0);
            t.setCreatedAt(Instant.now().minusSeconds(i)); 
            repo.save(t);
        });

        var page = PageRequest.of(0, 5);
        var result = repo.findByCompletedFalseOrderByCreatedAtDesc(page);

        assertThat(result).hasSize(5);
        assertThat(result).allMatch(t -> !t.isCompleted());
        // verify ordering: newer first
        assertThat(result)
                .isSortedAccordingTo((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
    }
}
