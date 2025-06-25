package sn.dev.media_service.services;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import sn.dev.media_service.data.entities.Media;

public interface MediaService {
    Media uploadAndSave(MultipartFile media, String productId);

    List<Media> findByProductId(String productId);

    Media findById(String id);

    void deleteById(String id);

    void deleteByProductId(String productId);
}