package com.examly.springapp.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>>
    handleValidation(MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
        .getFieldError()
        .getDefaultMessage();

        Map<String, String> response = new HashMap<>();
        response.put("message", message);

        return new ResponseEntity<>(
            response,
            HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(ValidationException.class)
        public ResponseEntity<Map<String, String>>
        handleValidationException(ValidationException ex) {

        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());

        return new ResponseEntity<>(
            response,
            HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<Map<String, String>>
        handleIllegalArgument(IllegalArgumentException ex) {

            Map<String, String> response = new HashMap<>();
            response.put("message", ex.getMessage());

            return new ResponseEntity<>(
                response,
                HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(ConstraintViolationException.class)
        public ResponseEntity<Map<String, String>>
        handleConstraintViolation(
        ConstraintViolationException ex) {

            Map<String, String> response = new HashMap<>();
            response.put("message", ex.getMessage());

            return new ResponseEntity<>(
                response,
                HttpStatus.BAD_REQUEST);
                }

                @ExceptionHandler(EntityNotFoundException.class)
                public ResponseEntity<Map<String, String>>
                handleNotFound(EntityNotFoundException ex) {

                    Map<String, String> response = new HashMap<>();
                    response.put("message", ex.getMessage());

                    return new ResponseEntity<>(
                        response,
                        HttpStatus.NOT_FOUND);
                    }

                    @ExceptionHandler(Exception.class)
                    public ResponseEntity<Map<String, String>>
                    handleGeneric(Exception ex) {

                    Map<String, String> response = new HashMap<>();
                    response.put("message", ex.getMessage());

                    return new ResponseEntity<>(
                        response,
                        HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                }
                
