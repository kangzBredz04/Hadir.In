import {
    Download,
    Share2,
    Smartphone
} from 'lucide-react';

import usePWAInstall from '../../hooks/usePWAInstall';

import Button from '../ui/Button';
import Card from '../ui/Card';

export default function PWAInstallCard() {
    const {
        installable,
        installed,
        isIOS,
        install
    } =
        usePWAInstall();

    /*
     * Kalau sudah sedang dibuka sebagai
     * installed PWA, card tidak perlu
     * ditampilkan lagi.
     */
    if (installed) {
        return null;
    }

    /*
     * Android/Chrome yang belum
     * memenuhi syarat install juga
     * tidak perlu menunjukkan card.
     *
     * Tetapi iOS tetap kita tampilkan
     * karena proses install manual.
     */
    if (
        !installable &&
        !isIOS
    ) {
        return null;
    }

    return (
        <Card
            className="
                overflow-hidden
                border-primary/20
                bg-primary-light
            "
        >
            <div
                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div
                    className="
                        flex
                        min-w-0
                        items-start
                        gap-4
                    "
                >
                    <div
                        className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            bg-primary
                            text-white
                        "
                    >
                        <Smartphone
                            size={23}
                            aria-hidden="true"
                        />
                    </div>

                    <div>
                        <h3
                            className="
                                font-bold
                                text-text
                            "
                        >
                            Install Hadir.In
                        </h3>

                        <p
                            className="
                                mt-1
                                max-w-xl
                                text-sm
                                leading-6
                                text-muted
                            "
                        >
                            Tambahkan Hadir.In
                            ke layar utama untuk
                            akses absensi yang
                            lebih cepat.
                        </p>
                    </div>
                </div>

                {!isIOS &&
                    installable && (
                        <Button
                            type="button"
                            className="
                                w-full
                                shrink-0
                                sm:w-auto
                            "
                            onClick={
                                install
                            }
                        >
                            <Download
                                size={18}
                                aria-hidden="true"
                            />

                            Install Aplikasi
                        </Button>
                    )}
            </div>

            {isIOS && (
                <div
                    className="
                        mt-4
                        rounded-xl
                        border
                        border-primary/10
                        bg-white/70
                        p-4
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >
                        <Share2
                            size={20}
                            className="
                                mt-0.5
                                shrink-0
                                text-primary
                            "
                            aria-hidden="true"
                        />

                        <p
                            className="
                                text-sm
                                leading-6
                                text-text
                            "
                        >
                            Di iPhone, buka
                            menu
                            <strong>
                                {' '}
                                Bagikan
                            </strong>
                            , lalu pilih
                            <strong>
                                {' '}
                                Tambah ke Layar Utama
                            </strong>
                            .
                        </p>
                    </div>
                </div>
            )}
        </Card>
    );
}