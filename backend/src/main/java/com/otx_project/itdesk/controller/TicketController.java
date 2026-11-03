
package com.otx_project.itdesk.controller;

import com.otx_project.itdesk.dto.CreateTicketRequest;
import com.otx_project.itdesk.dto.UpdateRequest;
import com.otx_project.itdesk.dto.TicketResponse;

import com.otx_project.itdesk.enums.Priority;
import com.otx_project.itdesk.enums.Status;

import com.otx_project.itdesk.service.TicketService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:4200")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // 1. CREATE TICKET
    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody CreateTicketRequest request) {

        TicketResponse response =
                ticketService.createTicket(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 2. GET ALL TICKETS WITH SEARCH AND FILTERS
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority) {

        List<TicketResponse> tickets =
                ticketService.getAllTickets(
                        search,
                        status,
                        priority
                );

        return ResponseEntity.ok(tickets);
    }

    // 3. GET TICKET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(
            @PathVariable Long id) {

        TicketResponse ticket =
                ticketService.getTicketById(id);

        return ResponseEntity.ok(ticket);
    }

    // 4. UPDATE TICKET
    @PutMapping("/{id}")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRequest request) {

        TicketResponse updatedTicket =
                ticketService.updateTicket(id, request);

        return ResponseEntity.ok(updatedTicket);
    }
}
