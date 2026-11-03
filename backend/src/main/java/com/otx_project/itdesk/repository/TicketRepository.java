
package com.otx_project.itdesk.repository;

import com.otx_project.itdesk.entity.TicketEntity;
import com.otx_project.itdesk.enums.Priority;
import com.otx_project.itdesk.enums.Status;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository
        extends JpaRepository<TicketEntity, Long> {

    @Query("""
        SELECT t FROM TicketEntity t
        WHERE
            (:status IS NULL OR t.status = :status)
        AND
            (:priority IS NULL OR t.priority = :priority)
        AND (
            :search IS NULL
            OR LOWER(t.title) LIKE CONCAT('%', :search, '%')
            OR LOWER(t.description) LIKE CONCAT('%', :search, '%')
            OR LOWER(t.requesterName) LIKE CONCAT('%', :search, '%')
            OR LOWER(t.requesterEmail) LIKE CONCAT('%', :search, '%')
        )
        ORDER BY t.createdAt DESC
        """)
    List<TicketEntity> searchTickets(
            @Param("search") String search,
            @Param("status") Status status,
            @Param("priority") Priority priority
    );
}
