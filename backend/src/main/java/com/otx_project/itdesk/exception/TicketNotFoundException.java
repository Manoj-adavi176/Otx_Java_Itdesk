package com.otx_project.itdesk.exception;

public class TicketNotFoundException
        extends RuntimeException {

    public TicketNotFoundException(Long id) {
        super("Ticket not found with ID: " + id);
    }
}
