
/**
 * Simple utility function to download a file from a byte array.
 * @param fileName the name of the file to download
 * @param byteData the byte array of the file
 */
export async function downloadBytesFile(fileName: string, byteData: BlobPart) {
    try {
        const blob = new Blob([byteData]);
        const downloadUrl = URL.createObjectURL(blob);

        const link = Object.assign(document.createElement('a'), {
            href: downloadUrl,
            download: fileName,
        });

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        throw new Error('Error downloading file');
    }
}