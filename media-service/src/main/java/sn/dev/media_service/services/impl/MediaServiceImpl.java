package sn.dev.media_service.services.impl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import sn.dev.media_service.data.entities.Media;
import sn.dev.media_service.data.repos.MediaRepo;
import sn.dev.media_service.services.CloudStorageService;
import sn.dev.media_service.services.MediaService;

@Service
public class MediaServiceImpl implements MediaService {
    private final MediaRepo mediaRepo;
    private final CloudStorageService cloudStorageService;

    public MediaServiceImpl(MediaRepo mediaRepo, CloudStorageService cloudStorageService) {
        this.mediaRepo = mediaRepo;
        this.cloudStorageService = cloudStorageService;
    }

    @Override
    public Media uploadAndSave(MultipartFile file, String productId) {
        // 1. Validate file
        String contentType = file.getContentType();
        if (contentType == null || !isSupportedImage(contentType)) {
            throw new IllegalArgumentException("Only JPEG, PNG, GIF and WEBP images are allowed.");
        }

        // 2. Upload file to cloud (e.g., Cloudinary, S3)
        String imageUrl = cloudStorageService.upload(file);

        // 3. Save media info to MongoDB
        Media media = new Media();
        media.setImageUrl(imageUrl);
        media.setProductId(productId);

        return mediaRepo.save(media);
    }

    @Override
    public String uploadImage(MultipartFile file) {
        // 1. Validate file
        String contentType = file.getContentType();
        if (contentType == null || !isSupportedImage(contentType)) {
            throw new IllegalArgumentException("Only JPEG, PNG, GIF and WEBP images are allowed.");
        }

        // 2. Upload file to cloud (e.g., Cloudinary, S3)
        return cloudStorageService.upload(file);
    }

    @Override
    public Media findById(String id) {
        return mediaRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Media not found with id: " + id));
    }

    @Override
    public List<Media> findByProductId(String productId) {
        return mediaRepo.findByProductId(productId);
    }

    @Override
    public void deleteById(String id) {
        mediaRepo.deleteById(id);
    }

    @Override
    public void deleteByProductId(String productId) {
        mediaRepo.deleteByProductId(productId);
    }

    private boolean isSupportedImage(String contentType) {
        return contentType.equals("image/jpeg") ||
                contentType.equals("image/png") ||
                contentType.equals("image/gif") ||
                contentType.equals("image/webp");
    }

}
