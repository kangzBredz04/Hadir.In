import {
    useRef
} from 'react';

import Webcam from 'react-webcam';

import {
    Camera,
    CheckCircle2,
    RefreshCw
} from 'lucide-react';

import Button from '../ui/Button';
import Card from '../ui/Card';

const videoConstraints = {
    facingMode: 'user'
};

export default function CameraCapture({
    preview,
    cameraReady,
    capturing,
    error,
    disabled = false,

    onCapture,
    onRetake,
    onUserMedia,
    onUserMediaError
}) {
    const webcamRef =
        useRef(null);

    return (
        <Card>
            <div
                className="
          flex
          items-center
          justify-between
          gap-3
        "
            >
                <div>
                    <p
                        className="
              text-sm
              font-semibold
              text-primary
            "
                    >
                        Foto Absensi
                    </p>

                    <h3
                        className="
              mt-1
              font-bold
              text-text
            "
                    >
                        Ambil Selfie
                    </h3>
                </div>

                {preview && (
                    <div
                        className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-green-50
              text-success
            "
                    >
                        <CheckCircle2
                            size={19}
                        />
                    </div>
                )}
            </div>

            <div
                className="
          mt-5
          overflow-hidden
          rounded-2xl
          bg-slate-950
        "
            >
                <div
                    className="
            relative
            aspect-[3/4]
            max-h-[520px]
            w-full
            sm:aspect-[4/3]
          "
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview selfie absensi"
                            className="
                h-full
                w-full
                object-cover
              "
                        />
                    ) : (
                        <Webcam
                            ref={webcamRef}

                            audio={false}

                            mirrored

                            screenshotFormat="image/jpeg"

                            screenshotQuality={
                                0.9
                            }

                            forceScreenshotSourceSize

                            videoConstraints={
                                videoConstraints
                            }

                            onUserMedia={
                                onUserMedia
                            }

                            onUserMediaError={
                                onUserMediaError
                            }

                            className="
                h-full
                w-full
                object-cover
              "
                        />
                    )}

                    {!preview &&
                        !cameraReady &&
                        !error && (
                            <div
                                className="
                  pointer-events-none
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  bg-slate-950/50
                "
                            >
                                <div
                                    className="
                    text-center
                    text-white
                  "
                                >
                                    <Camera
                                        size={32}
                                        className="mx-auto"
                                    />

                                    <p
                                        className="
                      mt-3
                      text-sm
                    "
                                    >
                                        Mengaktifkan kamera...
                                    </p>
                                </div>
                            </div>
                        )}
                </div>
            </div>

            {error && (
                <div
                    className="
            mt-4
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
          "
                    role="alert"
                >
                    <p
                        className="
              text-sm
              text-danger
            "
                    >
                        {error}
                    </p>
                </div>
            )}

            <div
                className="
          mt-4
          flex
          flex-col
          gap-3
          sm:flex-row
        "
            >
                {!preview ? (
                    <Button
                        className="w-full"
                        disabled={
                            disabled ||
                            !cameraReady
                        }
                        loading={
                            capturing
                        }
                        onClick={() =>
                            onCapture(
                                webcamRef
                            )
                        }
                    >
                        <Camera
                            size={18}
                        />

                        {capturing
                            ? 'Mengambil foto...'
                            : 'Ambil Foto'}
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        className="w-full"
                        disabled={
                            disabled
                        }
                        onClick={
                            onRetake
                        }
                    >
                        <RefreshCw
                            size={18}
                        />

                        Ambil Ulang
                    </Button>
                )}
            </div>

            {preview && (
                <p
                    className="
            mt-3
            text-center
            text-xs
            text-muted
          "
                >
                    Foto belum dikirim.
                    Pastikan foto sudah sesuai
                    sebelum melakukan absensi.
                </p>
            )}
        </Card>
    );
}