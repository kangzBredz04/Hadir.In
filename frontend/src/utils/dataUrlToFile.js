export async function dataUrlToFile(
    dataUrl,
    filename = `attendance-${Date.now()}.jpg`
) {
    if (!dataUrl) {
        throw new Error(
            'Data foto tidak tersedia.'
        );
    }

    const response =
        await fetch(dataUrl);

    const blob =
        await response.blob();

    return new File(
        [blob],
        filename,
        {
            type:
                blob.type ||
                'image/jpeg'
        }
    );
}