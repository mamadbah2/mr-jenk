package sn.dev.media_service.web.controllers;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import sn.dev.media_service.data.entities.Media;

@RequestMapping("/api/media")
public interface MediaController {
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<Media> uploadNsave(@RequestParam MultipartFile file,
            @RequestParam String productId);

    @GetMapping("/product/{productId}")
    ResponseEntity<List<Media>> getByProductId(@PathVariable String productId);

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteById(@PathVariable String id);

    @DeleteMapping("/product/{productId}")
    ResponseEntity<Void> deleteByProductId(@PathVariable String productId);
}
