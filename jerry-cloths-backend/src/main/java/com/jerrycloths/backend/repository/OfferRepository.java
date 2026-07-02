package com.jerrycloths.backend.repository;

import com.jerrycloths.backend.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    List<Offer> findAllByOrderByCreatedAtDesc();

    // Active = isActive true AND current time within date range
    // If no dates set on an offer, it's always in range (null = no restriction)
    @Query("SELECT o FROM Offer o WHERE o.isActive = true " +
            "AND (o.startDate IS NULL OR o.startDate <= :now) " +
            "AND (o.endDate IS NULL OR o.endDate >= :now) " +
            "ORDER BY o.createdAt DESC")
    List<Offer> findCurrentlyActive(@Param("now") LocalDateTime now);
}