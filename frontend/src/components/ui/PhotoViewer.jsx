import {
    useState
} from 'react';

import {
    Expand,
    ImageOff
} from 'lucide-react';

import Modal from './Modal';

export default function PhotoViewer({
    src,
    alt = 'Foto absensi'
}) {
    const [
        open,
        setOpen
    ] =
        useState(false);

    const [
        failed,
        setFailed
    ] =
        useState(false);

    if (
        !src ||
        failed
    ) {
        return (
            <div
                className="
          flex
          aspect-[4/3]
          items-center
          justify-center
          rounded-2xl
          bg-background
        "
            >
                <div
                    className="
            text-center
            text-muted
          "
                >
                    <ImageOff
                        size={28}
                        className="mx-auto"
                    />

                    <p
                        className="
              mt-2
              text-xs
            "
                    >
                        Foto tidak tersedia
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <button
                type="button"
                className="
          group
          relative
          block
          w-full
          overflow-hidden
          rounded-2xl
          bg-background
        "
                onClick={() =>
                    setOpen(true)
                }
                aria-label={
                    `Perbesar ${alt}`
                }
            >
                <img
                    src={src}
                    alt={alt}
                    onError={() =>
                        setFailed(true)
                    }
                    className="
            aspect-[4/3]
            w-full
            object-cover
            transition
            duration-300
            group-hover:scale-[1.02]
          "
                />

                <div
                    className="
            absolute
            right-3
            top-3
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-slate-950/60
            text-white
          "
                >
                    <Expand
                        size={17}
                    />
                </div>
            </button>

            <Modal
                open={open}
                title={alt}
                maxWidth="max-w-5xl"
                onClose={() =>
                    setOpen(false)
                }
            >
                <img
                    src={src}
                    alt={alt}
                    className="
            mx-auto
            max-h-[75vh]
            w-auto
            rounded-2xl
            object-contain
          "
                />
            </Modal>
        </>
    );
}