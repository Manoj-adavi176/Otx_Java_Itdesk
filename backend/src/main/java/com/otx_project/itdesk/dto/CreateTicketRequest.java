package com.otx_project.itdesk.dto;

import com.otx_project.itdesk.enums.Category;
import com.otx_project.itdesk.enums.Priority;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTicketRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 255)
        String title,

        @NotBlank(message = "Description is required")
        @Size(max = 2000)
        String description,

        @NotNull(message = "Category is required")
        Category category,

        @NotNull(message = "Priority is required")
        Priority priority,

        @NotBlank(message = "Requester name is required")
        String requesterName,

        @NotBlank(message = "Requester email is required")
        @Email(message = "Enter a valid email address")
        String requesterEmail

) {}