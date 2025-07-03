package sn.dev.product_service.services;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import sn.dev.product_service.config.FeignSupportConfig;
import sn.dev.product_service.data.entities.Media;

@FeignClient(name = "media-service", url = "${media.service.url}", configuration = FeignSupportConfig.class)
public interface MediaServiceClient {
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    Media upload(@RequestParam MultipartFile file,
            @RequestParam String productId);
}