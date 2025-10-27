package org.example.todobackend.service;

import org.example.todobackend.entity.Task;
import org.example.todobackend.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
@Import(TaskService.class)     // bring the service in
@ActiveProfiles("test")
class TaskServiceTest {

    @Autowired
    TaskRepository repo;

    @Autowired
    TaskService service;

    @BeforeEach
    void clean() {
        repo.deleteAll();
    }

    @Test
    void create_persistsAndReturns() {
        Task saved = service.create("Buy", "Milk");
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTitle()).isEqualTo("Buy");          // ✅ assert on returned entity

        // or reload by id to be extra sure
        Task reloaded = repo.findById(saved.getId()).orElseThrow();
        assertThat(reloaded.getTitle()).isEqualTo("Buy");
        assertThat(reloaded.isCompleted()).isFalse();
    }

    @Test
    void complete_marksTaskDone_idempotent() {
        Task t = service.create("A", "b");
        service.complete(t.getId());
        assertThat(repo.findById(t.getId()).orElseThrow().isCompleted()).isTrue();

        // idempotent: calling again doesn’t break
        service.complete(t.getId());
        assertThat(repo.findById(t.getId()).orElseThrow().isCompleted()).isTrue();
    }

    @Test
    void complete_throwsForMissingId() {
        assertThrows(IllegalArgumentException.class, () -> service.complete(9999L));
    }

    @Test
    void listRecentIncomplete_capsLimitAndSorts() {
        // 6 tasks, last one completed
        Task last = null;
        for (int i = 0; i < 6; i++) {
            last = service.create("T" + i, "");
        }
        // mark the latest as completed so it doesn’t show up
        service.complete(last.getId());

        var list = service.listRecentIncomplete(50);
        assertThat(list).hasSize(5);                               // capped at 5 by repo pageable
        assertThat(list).allMatch(t -> !t.isCompleted());          // no completed
        assertThat(list)
                .isSortedAccordingTo((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
    }
}
