package com.otx_project.itdesk.service;

import com.otx_project.itdesk.dto.*;
import com.otx_project.itdesk.enums.Priority;
import com.otx_project.itdesk.enums.Status;

import java.util.List;

public interface TicketService {

    TicketResponse createTicket(
            CreateTicketRequest request
    );

    List<TicketResponse> getAllTickets(
            String search,
            Status status,
            Priority priority
    );

    TicketResponse getTicketById(Long id);

    TicketResponse updateTicket(
            Long id,
            UpdateRequest request
    );
}
