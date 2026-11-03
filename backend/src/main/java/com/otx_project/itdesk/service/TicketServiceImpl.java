
package com.otx_project.itdesk.service;

import com.otx_project.itdesk.dto.CreateTicketRequest;
import com.otx_project.itdesk.dto.UpdateRequest;
import com.otx_project.itdesk.dto.TicketResponse;

import com.otx_project.itdesk.entity.TicketEntity;

import com.otx_project.itdesk.enums.Priority;
import com.otx_project.itdesk.enums.Status;

import com.otx_project.itdesk.exception.TicketNotFoundException;
import com.otx_project.itdesk.repository.TicketRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;

    public TicketServiceImpl(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    // 1. CREATE TICKET
    @Override
    @Transactional
    public TicketResponse createTicket(
            CreateTicketRequest request) {

        TicketEntity ticket = new TicketEntity();

        ticket.setTitle(request.title().trim());
        ticket.setDescription(request.description().trim());
        ticket.setCategory(request.category());
        ticket.setPriority(request.priority());

        ticket.setRequesterName(
                request.requesterName().trim()
        );

        ticket.setRequesterEmail(
                request.requesterEmail().trim()
        );

        ticket.setStatus(Status.OPEN);

        TicketEntity savedTicket =
                ticketRepository.save(ticket);

        return mapToResponse(savedTicket);
    }

    // 2. GET ALL TICKETS WITH OPTIONAL FILTERS
    @Override
    @Transactional(readOnly = true)
    public List<TicketResponse> getAllTickets(
            String search,
            Status status,
            Priority priority) {

        String normalizedSearch =
                (search == null || search.isBlank())
                        ? null
                        : search.trim().toLowerCase(Locale.ROOT);

        List<TicketEntity> tickets =
                ticketRepository.searchTickets(
                        normalizedSearch,
                        status,
                        priority
                );

        return tickets.stream()
                .map(this::mapToResponse)
                .toList();
    }

    // 3. GET TICKET BY ID
    @Override
    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long id) {

        TicketEntity ticket =
                ticketRepository.findById(id)
                        .orElseThrow(
                                () -> new TicketNotFoundException(id)
                        );

        return mapToResponse(ticket);
    }

    // 4. UPDATE TICKET
    @Override
    @Transactional
    public TicketResponse updateTicket(
            Long id,
            UpdateRequest request) {

        TicketEntity ticket =
                ticketRepository.findById(id)
                        .orElseThrow(
                                () -> new TicketNotFoundException(id)
                        );

        String note = request.resolutionNote();

        // Retain existing note if none is provided
        if (note == null) {
            note = ticket.getResolutionNote();
        }

        if (note != null) {
            note = note.trim();
        }

        // Business rule:
        // RESOLVED requires a resolution note
        if (request.status() == Status.RESOLVED
                && (note == null || note.isBlank())) {

            throw new IllegalArgumentException(
                    "Resolution note is required when status is RESOLVED"
            );
        }

        ticket.setStatus(request.status());
        ticket.setResolutionNote(note);

        TicketEntity updatedTicket =
                ticketRepository.save(ticket);

        return mapToResponse(updatedTicket);
    }

    // 5. CONVERT ENTITY INTO RESPONSE DTO
    private TicketResponse mapToResponse(TicketEntity ticket) {

        return new TicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getRequesterName(),
                ticket.getRequesterEmail(),
                ticket.getStatus(),
                ticket.getResolutionNote(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }
}
