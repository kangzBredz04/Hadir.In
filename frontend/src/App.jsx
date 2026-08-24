import {
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

import Badge from './components/ui/Badge';
import Button from './components/ui/Button';
import Card from './components/ui/Card';

function SetupPreview() {
  return (
    <main
      className="
        min-h-screen
        bg-background
        px-4
        py-8
        sm:px-6
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl
        "
      >
        <header
          className="
            mb-8
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-primary
                text-white
                shadow-sm
              "
            >
              <Building2
                size={23}
                aria-hidden="true"
              />
            </div>

            <div>
              <h1
                className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-primary-dark
                "
              >
                Hadir.In
              </h1>

              <p
                className="
                  text-xs
                  text-muted
                "
              >
                Employee Attendance System
              </p>
            </div>
          </div>

          <Badge variant="success">
            Frontend siap
          </Badge>
        </header>

        <section
          className="
            overflow-hidden
            rounded-3xl
            bg-primary-dark
            px-6
            py-8
            text-white
            shadow-sm
            sm:px-8
            sm:py-10
          "
        >
          <div
            className="
              grid
              gap-8
              lg:grid-cols-[1.3fr_0.7fr]
              lg:items-center
            "
          >
            <div>
              <span
                className="
                  mb-3
                  inline-block
                  text-sm
                  font-semibold
                  text-blue-200
                "
              >
                Tahap 1 selesai
              </span>

              <h2
                className="
                  max-w-2xl
                  text-2xl
                  font-bold
                  leading-tight
                  sm:text-3xl
                "
              >
                Sistem absensi yang
                sederhana untuk digunakan,
                tetapi tetap profesional.
              </h2>

              <p
                className="
                  mt-4
                  max-w-2xl
                  text-sm
                  leading-7
                  text-blue-100
                  sm:text-base
                "
              >
                Fondasi React, Tailwind,
                routing, API layer, design
                system, dan komponen UI dasar
                sudah siap digunakan.
              </p>

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  gap-3
                "
              >
                <Button
                  variant="secondary"
                >
                  Mulai Absensi
                </Button>

                <Button
                  variant="outline"
                  className="
                    border-white/30
                    bg-white/10
                    text-white
                    hover:bg-white/20
                  "
                >
                  Lihat Dashboard
                </Button>
              </div>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-white/15
                bg-white/10
                p-5
                backdrop-blur
              "
            >
              <div
                className="
                  mb-5
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-xs
                      font-medium
                      text-blue-200
                    "
                  >
                    Status Absensi
                  </p>

                  <h3
                    className="
                      mt-1
                      text-lg
                      font-semibold
                    "
                  >
                    Hari ini
                  </h3>
                </div>

                <CheckCircle2
                  size={28}
                  className="text-green-300"
                  aria-hidden="true"
                />
              </div>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                "
              >
                <div
                  className="
                    rounded-xl
                    bg-white/10
                    p-3
                  "
                >
                  <Clock3
                    size={18}
                    className="mb-2"
                  />

                  <p
                    className="
                      text-xs
                      text-blue-200
                    "
                  >
                    Check In
                  </p>

                  <strong>
                    07:58
                  </strong>
                </div>

                <div
                  className="
                    rounded-xl
                    bg-white/10
                    p-3
                  "
                >
                  <MapPin
                    size={18}
                    className="mb-2"
                  />

                  <p
                    className="
                      text-xs
                      text-blue-200
                    "
                  >
                    Jarak
                  </p>

                  <strong>
                    73 m
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="
            mt-8
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <Card>
            <div
              className="
                mb-4
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-primary-light
                text-primary
              "
            >
              <Smartphone
                size={20}
                aria-hidden="true"
              />
            </div>

            <h3
              className="
                font-semibold
                text-text
              "
            >
              Mobile First
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-muted
              "
            >
              Tampilan dirancang dari
              layar smartphone terlebih
              dahulu agar proses absensi
              nyaman digunakan.
            </p>
          </Card>

          <Card>
            <div
              className="
                mb-4
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-primary-light
                text-primary
              "
            >
              <ShieldCheck
                size={20}
                aria-hidden="true"
              />
            </div>

            <h3
              className="
                font-semibold
                text-text
              "
            >
              Backend Driven
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-muted
              "
            >
              Frontend hanya bertanggung
              jawab pada UX dan request.
              Validasi authorization tetap
              dilakukan backend.
            </p>
          </Card>

          <Card
            className="
              sm:col-span-2
              lg:col-span-1
            "
          >
            <div
              className="
                mb-4
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-primary-light
                text-primary
              "
            >
              <MapPin
                size={20}
                aria-hidden="true"
              />
            </div>

            <h3
              className="
                font-semibold
                text-text
              "
            >
              GPS Attendance
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-muted
              "
            >
              Arsitektur sudah dipersiapkan
              untuk integrasi kamera, GPS,
              dan validasi radius backend.
            </p>
          </Card>
        </section>

        <section className="mt-8">
          <Card>
            <div
              className="
                flex
                flex-col
                gap-5
                md:flex-row
                md:items-center
                md:justify-between
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
                  Design System
                </p>

                <h3
                  className="
                    mt-1
                    text-lg
                    font-semibold
                    text-text
                  "
                >
                  Status component preview
                </h3>
              </div>

              <div
                className="
                  flex
                  flex-wrap
                  gap-2
                "
              >
                <Badge variant="success">
                  Hadir
                </Badge>

                <Badge variant="warning">
                  Terlambat
                </Badge>

                <Badge variant="danger">
                  Tidak Hadir
                </Badge>

                <Badge>
                  Belum Absensi
                </Badge>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}

export default function App() {
  return <SetupPreview />;
}