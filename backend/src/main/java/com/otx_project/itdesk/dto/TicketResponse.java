package com.otx_project.itdesk.dto;

import com.otx_project.itdesk.enums.Category;
import com.otx_project.itdesk.enums.Priority;
import com.otx_project.itdesk.enums.Status;

import java.time.LocalDateTime;

public record TicketResponse(

        Long id,
        String title,
        String description,
        Category category,
        Priority priority,
        String requesterName,
        String requesterEmail,
        Status status,
        String resolutionNote,
        LocalDateTime createdAt,
        LocalDateTime updatedAt

) {}
