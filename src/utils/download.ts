
/**
 * Simple utility function to download a file from a byte array.
 * @param fileName the name of the file to download
 * @param byteData the byte array of the file
 */
export async function downloadBytesFile(fileName: string, byteData: BlobPart) {
    try {
        const blob = new Blob([byteData]);
        
        if ((window as any).showSaveFilePicker !== undefined) {
            const handle = await (window as any).showSaveFilePicker({
                suggestedName: fileName,
            });
    
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
        } else {
            const downloadUrl = URL.createObjectURL(blob);
    
            const link = Object.assign(document.createElement('a'), {
                href: downloadUrl,
                download: fileName,
            });
    
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
        }
        

    } catch (error) {
        console.error("Error downloading file", error);
        if ((error as Error & { name?: string })?.name !== 'AbortError') throw new Error('Error downloading file');
    }
}