package com.EVENTORA.repository;

import com.EVENTORA.domain.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TheatreRepository extends JpaRepository<Theatre, UUID> {
}
