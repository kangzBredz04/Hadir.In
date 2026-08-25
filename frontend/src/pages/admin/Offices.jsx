import {
    Building2,
    Eye,
    Pencil,
    Plus,
    Power,
    Search
} from 'lucide-react';

import {
    useCallback,
    useEffect,
    useState
} from 'react';

import OfficeDetail from '../../components/office/OfficeDetail';
import OfficeForm from '../../components/office/OfficeForm';

import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';

import useToast from '../../hooks/useToast';

import {
    createAdminOffice,
    deactivateAdminOffice,
    getAdminOffices,
    updateAdminOffice
} from '../../services/office.service';

import {
    handleApiError
} from '../../utils/errorHandler';

export default function AdminOffices() {
    const [
        draftFilters,
        setDraftFilters
    ] =
        useState({
            search: '',
            isActive: ''
        });

    const [
        filters,
        setFilters
    ] =
        useState({
            search: '',
            isActive: ''
        });

    const [
        page,
        setPage
    ] =
        useState(1);

    const toast =
        useToast();

    const [
        items,
        setItems
    ] =
        useState([]);

    const [
        pagination,
        setPagination
    ] =
        useState({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0
        });

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        error,
        setError
    ] =
        useState('');

    const [
        success,
        setSuccess
    ] =
        useState('');

    const [
        createOpen,
        setCreateOpen
    ] =
        useState(false);

    const [
        editOffice,
        setEditOffice
    ] =
        useState(null);

    const [
        detailOffice,
        setDetailOffice
    ] =
        useState(null);

    const [
        deactivateOffice,
        setDeactivateOffice
    ] =
        useState(null);

    const [
        deactivating,
        setDeactivating
    ] =
        useState(false);

    const loadOffices =
        useCallback(
            async () => {
                setLoading(true);
                setError('');

                try {
                    const result =
                        await getAdminOffices({
                            page,
                            limit: 10,

                            search:
                                filters.search,

                            isActive:
                                filters.isActive
                        });

                    setItems(
                        result.items
                    );

                    setPagination(
                        result.pagination
                    );
                } catch (
                requestError
                ) {
                    setError(
                        handleApiError(
                            requestError,
                            'Data kantor gagal dimuat.'
                        )
                    );
                } finally {
                    setLoading(false);
                }
            },
            [
                page,
                filters
            ]
        );

    useEffect(() => {
        loadOffices();
    }, [loadOffices]);

    const handleCreate =
        async payload => {
            await createAdminOffice(
                payload
            );

            setCreateOpen(false);

            toast.success(
                'Kantor berhasil ditambahkan.'
            );

            setPage(1);

            await loadOffices();
        };

    const handleUpdate =
        async payload => {
            await updateAdminOffice(
                editOffice.id,
                payload
            );

            setEditOffice(null);

            toast.success(
                'Kantor berhasil diperbarui.'
            );

            await loadOffices();
        };

    const handleDeactivate =
        async () => {
            if (!deactivateOffice) {
                return;
            }

            setDeactivating(true);

            try {
                await deactivateAdminOffice(
                    deactivateOffice.id
                );

                setDeactivateOffice(null);

                toast.success(
                    'Kantor berhasil dinonaktifkan.'
                );

                await loadOffices();
            } catch (requestError) {
                toast.error(
                    handleApiError(
                        requestError,
                        'Kantor gagal dinonaktifkan.'
                    )
                );
            } finally {
                setDeactivating(
                    false
                );
            }
        };

    return (
        <div className="space-y-5">
            <section
                className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-end
          sm:justify-between
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
                        Management
                    </p>

                    <h2
                        className="
              mt-1
              text-2xl
              font-bold
              text-text
            "
                    >
                        Offices
                    </h2>

                    <p
                        className="
              mt-2
              text-sm
              text-muted
            "
                    >
                        Kelola lokasi dan radius absensi kantor.
                    </p>
                </div>

                <Button
                    onClick={() =>
                        setCreateOpen(true)
                    }
                >
                    <Plus size={18} />
                    Tambah Kantor
                </Button>
            </section>

            {success && (
                <Card
                    className="
            border-green-200
            bg-green-50
          "
                >
                    <p className="text-sm text-success">
                        {success}
                    </p>
                </Card>
            )}

            {error && (
                <Card
                    className="
            border-red-200
            bg-red-50
          "
                >
                    <p className="text-sm text-danger">
                        {error}
                    </p>
                </Card>
            )}

            <Card>
                <form
                    className="
            grid
            gap-3
            md:grid-cols-[1fr_220px_auto]
            md:items-end
          "
                    onSubmit={
                        event => {
                            event.preventDefault();

                            setFilters({
                                ...draftFilters
                            });

                            setPage(1);
                        }
                    }
                >
                    <Input
                        label="Cari Kantor"
                        value={
                            draftFilters.search
                        }
                        placeholder="Nama atau alamat..."
                        onChange={
                            event =>
                                setDraftFilters(
                                    previous => ({
                                        ...previous,
                                        search:
                                            event.target.value
                                    })
                                )
                        }
                    />

                    <Select
                        label="Status"
                        value={
                            draftFilters.isActive
                        }
                        onChange={
                            event =>
                                setDraftFilters(
                                    previous => ({
                                        ...previous,
                                        isActive:
                                            event.target.value
                                    })
                                )
                        }
                    >
                        <option value="">
                            Semua Status
                        </option>

                        <option value="true">
                            Aktif
                        </option>

                        <option value="false">
                            Tidak Aktif
                        </option>
                    </Select>

                    <Button type="submit">
                        <Search size={17} />
                        Filter
                    </Button>
                </form>
            </Card>

            <Card
                className="
          overflow-hidden
          p-0
        "
            >
                {loading ? (
                    <div
                        className="
              flex
              min-h-72
              items-center
              justify-center
            "
                    >
                        <Spinner
                            label="Memuat kantor..."
                        />
                    </div>
                ) : items.length === 0 ? (
                    <EmptyState
                        icon={Building2}
                        title="Belum ada kantor yang terdaftar."
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table
                                className="
                  w-full
                  min-w-[850px]
                "
                            >
                                <thead className="bg-background">
                                    <tr>
                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Nama
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Alamat
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Radius
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {items.map(
                                        office => (
                                            <tr
                                                key={office.id}
                                                className="
                          border-t
                          border-border
                        "
                                            >
                                                <td className="px-5 py-4 text-sm font-semibold text-text">
                                                    {office.name}
                                                </td>

                                                <td className="max-w-xs px-5 py-4 text-sm text-muted">
                                                    {office.address}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-text">
                                                    {office.radiusMeter}
                                                    {' '}
                                                    m
                                                </td>

                                                <td className="px-5 py-4">
                                                    <Badge
                                                        variant={
                                                            office.isActive
                                                                ? 'success'
                                                                : 'danger'
                                                        }
                                                    >
                                                        {office.isActive
                                                            ? 'Aktif'
                                                            : 'Tidak Aktif'}
                                                    </Badge>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setDetailOffice(
                                                                    office
                                                                )
                                                            }
                                                            className="rounded-lg p-2 text-primary hover:bg-primary-light"
                                                        >
                                                            <Eye size={17} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setEditOffice(
                                                                    office
                                                                )
                                                            }
                                                            className="rounded-lg p-2 text-warning hover:bg-orange-50"
                                                        >
                                                            <Pencil size={17} />
                                                        </button>

                                                        {office.isActive && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setDeactivateOffice(
                                                                        office
                                                                    )
                                                                }
                                                                className="rounded-lg p-2 text-danger hover:bg-red-50"
                                                            >
                                                                <Power size={17} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div
                            className="
                border-t
                border-border
                px-5
                py-4
              "
                        >
                            <Pagination
                                page={
                                    pagination.page
                                }
                                totalPages={
                                    pagination.totalPages
                                }
                                total={
                                    pagination.total
                                }
                                disabled={loading}
                                onPageChange={
                                    setPage
                                }
                            />
                        </div>
                    </>
                )}
            </Card>

            <Modal
                open={createOpen}
                title="Tambah Kantor"
                onClose={() =>
                    setCreateOpen(false)
                }
            >
                <OfficeForm
                    onSubmit={
                        handleCreate
                    }
                    onCancel={() =>
                        setCreateOpen(false)
                    }
                />
            </Modal>

            <Modal
                open={
                    Boolean(
                        editOffice
                    )
                }
                title="Edit Kantor"
                onClose={() =>
                    setEditOffice(null)
                }
            >
                <OfficeForm
                    key={
                        editOffice?.id
                    }
                    office={
                        editOffice
                    }
                    onSubmit={
                        handleUpdate
                    }
                    onCancel={() =>
                        setEditOffice(null)
                    }
                />
            </Modal>

            <Modal
                open={
                    Boolean(
                        detailOffice
                    )
                }
                title="Detail Kantor"
                onClose={() =>
                    setDetailOffice(null)
                }
            >
                <OfficeDetail
                    office={
                        detailOffice
                    }
                />
            </Modal>

            <ConfirmDialog
                open={
                    Boolean(
                        deactivateOffice
                    )
                }
                title="Nonaktifkan Kantor?"
                message={`Kantor ${deactivateOffice?.name ?? ''} akan dinonaktifkan. Pastikan tidak ada employee aktif yang masih membutuhkan kantor ini.`}
                confirmLabel="Nonaktifkan"
                loading={
                    deactivating
                }
                onClose={() =>
                    setDeactivateOffice(
                        null
                    )
                }
                onConfirm={
                    handleDeactivate
                }
            />
        </div>
    );
}