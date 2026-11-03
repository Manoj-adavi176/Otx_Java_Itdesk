
package com.otx_project.itdesk.dto;

import com.otx_project.itdesk.enums.Status;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateRequest(

        @NotNull(message = "Status is required")
        Status status,

        @Size(max = 2000)
        String resolutionNote

) {}
