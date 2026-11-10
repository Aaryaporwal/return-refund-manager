
package com.aarya.backend;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
@RestController
public class ReturnController {

    private final ReturnRequestRepository repository;

    public ReturnController(ReturnRequestRepository repository) {
        this.repository = repository;
    }

    // Get all return requests
    @GetMapping("/returns")
    public List<ReturnRequest> getReturns() {
        return repository.findAll();
    }

    // Create a new return request
    @PostMapping("/returns")
    public ReturnRequest createReturn(@RequestBody ReturnRequest request) {
        return repository.save(request);
    }

    // Update the status of a return request
    @PutMapping("/returns/{id}/status")
    public ReturnRequest updateStatus(
            @PathVariable Long id,
            @RequestBody String status) {

        ReturnRequest request = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Return request not found with ID: " + id));

        request.setStatus(status);
        return repository.save(request);
    }

    // Check return eligibility
    @GetMapping("/returns/{id}/eligibility")
    public String checkEligibility(@PathVariable Long id) {

        ReturnRequest request = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Return request not found with ID: " + id));

        if (request.isEligibleForReturn()) {
            return "This product is eligible for return.";
        } else {
            return "This product is not eligible for return.";
        }
    }
}
