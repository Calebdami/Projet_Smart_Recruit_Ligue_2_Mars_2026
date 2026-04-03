import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config/index.js";
import fs from 'fs/promises';

const s3Client = new S3Client({
    region: process.env.S3_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: true,
});

export const StorageService = {
    /**
     * Upload a file to S3
     * @param {string} localPath - Path to the local file
     * @param {string} key - S3 object key (path in bucket)
     * @param {string} contentType - MIME type
     */
    async uploadFile(localPath, key, contentType) {
        try {
            const fileContent = await fs.readFile(localPath);
            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: key,
                Body: fileContent,
                ContentType: contentType,
            });

            await s3Client.send(command);
            
            // Delete local file after upload if it's in the uploads folder
            if (localPath.includes('uploads/')) {
                await fs.unlink(localPath);
            }

            return `s3://${process.env.S3_BUCKET}/${key}`;
        } catch (error) {
            console.error('S3 Upload Error:', error);
            throw new Error('Failed to upload file to storage');
        }
    },

    /**
     * Get a presigned URL for a file
     * @param {string} key - S3 object key
     * @returns {Promise<string>}
     */
    async getDownloadUrl(key) {
        try {
            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: key,
            });

            return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        } catch (error) {
            console.error('S3 Presigned URL Error:', error);
            throw new Error('Failed to generate download URL');
        }
    },

    /**
     * Delete a file from S3
     * @param {string} key - S3 object key
     */
    async deleteFile(key) {
        try {
            const command = new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: key,
            });

            await s3Client.send(command);
        } catch (error) {
            console.error('S3 Delete Error:', error);
            throw new Error('Failed to delete file from storage');
        }
    }
};
