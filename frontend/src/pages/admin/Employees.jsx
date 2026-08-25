import {
    Eye,
    Pencil,
    Plus,
    Search,
    UserX,
    Users
} from 'lucide-react';

import {
    useCallback,
    useEffect,
    useState
} from 'react';

import {
    useSearchParams
} from 'react-router-dom';

import EmployeeDetail from '../../components/employee/EmployeeDetail';
import EmployeeForm from '../../components/employee/EmployeeForm';

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
    createAdminUser,
    deactivateAdminUser,
    getAdminUsers,
    updateAdminUser
} from '../../services/user.service';

import {
    getAdminOffices
} from '../../services/office.service';

import {
    handleApiError
} from '../../utils/errorHandler';

export default function AdminEmployees() {
    const [
        searchParams
    ] =
        useSearchParams();

    const initialSearch =
        searchParams.get(
            'search'
        ) ?? '';

    const [
        draftFilters,
        setDraftFilters
    ] =
        useState({
            search:
                initialSearch,

            officeId:
                '',

            isActive:
                ''
        });

    const [
        filters,
        setFilters
    ] =
        useState({
            search:
                initialSearch,

            officeId:
                '',

            isActive:
                ''
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
        offices,
        setOffices
    ] =
        useState([]);

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
        editEmployee,
        setEditEmployee
    ] =
        useState(null);

    const [
        detailEmployee,
        setDetailEmployee
    ] =
        useState(null);

    const [
        deactivateEmployee,
        setDeactivateEmployee
    ] =
        useState(null);

    const [
        deactivating,
        setDeactivating
    ] =
        useState(false);

    const loadEmployees =
        useCallback(
            async () => {
                setLoading(true);
                setError('');

                try {
                    const result =
                        await getAdminUsers({
                            page,
                            limit: 10,

                            search:
                                filters.search,

                            role:
                                'EMPLOYEE',

                            officeId:
                                filters.officeId,

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
                            'Data employee gagal dimuat.'
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
        loadEmployees();
    }, [loadEmployees]);

    useEffect(() => {
        getAdminOffices({
            page: 1,
            limit: 100
        })
            .then(
                result =>
                    setOffices(
                        result.items
                    )
            )
            .catch(() => {
                setOffices([]);
            });
    }, []);

    const handleCreate =
        async payload => {
            await createAdminUser(
                payload
            );

            setCreateOpen(false);

            toast.success(
                'Employee berhasil ditambahkan.'
            );

            setPage(1);

            await loadEmployees();
        };

    const handleUpdate =
        async payload => {
            await updateAdminUser(
                editEmployee.id,
                payload
            );

            setEditEmployee(null);

            toast.success(
                'Employee berhasil diperbarui.'
            );

            await loadEmployees();
        };

    const handleDeactivate =
        async () => {
            if (!deactivateEmployee) {
                return;
            }

            setDeactivating(true);

            try {
                await deactivateAdminUser(
                    deactivateEmployee.id
                );

                setDeactivateEmployee(
                    null
                );

                toast.success(
                    'Employee berhasil dinonaktifkan.'
                );

                await loadEmployees();
            } catch (requestError) {
                const message =
                    handleApiError(
                        requestError,
                        'Employee gagal dinonaktifkan.'
                    );

                toast.error(message);
            } finally {
                setDeactivating(false);
            }
        };

    const applyFilter =
        event => {
            event.preventDefault();

            setFilters({
                ...draftFilters
            });

            setPage(1);
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
                        Employees
                    </h2>

                    <p
                        className="
              mt-2
              text-sm
              text-muted
            "
                    >
                        Kelola akun karyawan dan penempatan kantor.
                    </p>
                </div>

                <Button
                    onClick={() =>
                        setCreateOpen(
                            true
                        )
                    }
                >
                    <Plus size={18} />

                    Tambah Employee
                </Button>
            </section>

            {success && (
                <Card
                    className="
            border-green-200
            bg-green-50
          "
                >
                    <p
                        className="
              text-sm
              text-success
            "
                    >
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
                    <p
                        className="
              text-sm
              text-danger
            "
                    >
                        {error}
                    </p>
                </Card>
            )}

            <Card>
                <form
                    onSubmit={
                        applyFilter
                    }
                    className="
            grid
            gap-3
            lg:grid-cols-[1fr_240px_180px_auto]
            lg:items-end
          "
                >
                    <Input
                        label="Cari Employee"
                        placeholder="Nama, email, employee ID..."
                        value={
                            draftFilters.search
                        }
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
                        label="Kantor"
                        value={
                            draftFilters.officeId
                        }
                        onChange={
                            event =>
                                setDraftFilters(
                                    previous => ({
                                        ...previous,
                                        officeId:
                                            event.target.value
                                    })
                                )
                        }
                    >
                        <option value="">
                            Semua Kantor
                        </option>

                        {offices.map(
                            office => (
                                <option
                                    key={office.id}
                                    value={office.id}
                                >
                                    {office.name}
                                </option>
                            )
                        )}
                    </Select>

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

                    <Button
                        type="submit"
                    >
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
                            label="Memuat employee..."
                        />
                    </div>
                ) : items.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="Belum ada employee."
                        description="Employee yang terdaftar akan muncul di sini."
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table
                                className="
                  w-full
                  min-w-[900px]
                "
                            >
                                <thead className="bg-background">
                                    <tr>
                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Employee ID
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Nama
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Email
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Office
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
                                        employee => (
                                            <tr
                                                key={
                                                    employee.id
                                                }
                                                className="
                          border-t
                          border-border
                        "
                                            >
                                                <td className="px-5 py-4 text-sm font-semibold text-text">
                                                    {employee.employeeId}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-text">
                                                    {employee.name}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-muted">
                                                    {employee.email}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-muted">
                                                    {employee.office?.name ??
                                                        '-'}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <Badge
                                                        variant={
                                                            employee.isActive
                                                                ? 'success'
                                                                : 'danger'
                                                        }
                                                    >
                                                        {employee.isActive
                                                            ? 'Aktif'
                                                            : 'Tidak Aktif'}
                                                    </Badge>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div
                                                        className="
                              flex
                              items-center
                              gap-1
                            "
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setDetailEmployee(
                                                                    employee
                                                                )
                                                            }
                                                            className="
                                rounded-lg
                                p-2
                                text-primary
                                hover:bg-primary-light
                              "
                                                            aria-label="Detail employee"
                                                        >
                                                            <Eye size={17} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setEditEmployee(
                                                                    employee
                                                                )
                                                            }
                                                            className="
                                rounded-lg
                                p-2
                                text-warning
                                hover:bg-orange-50
                              "
                                                            aria-label="Edit employee"
                                                        >
                                                            <Pencil size={17} />
                                                        </button>

                                                        {employee.isActive && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setDeactivateEmployee(
                                                                        employee
                                                                    )
                                                                }
                                                                className="
                                  rounded-lg
                                  p-2
                                  text-danger
                                  hover:bg-red-50
                                "
                                                                aria-label="Nonaktifkan employee"
                                                            >
                                                                <UserX size={17} />
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
                title="Tambah Employee"
                onClose={() =>
                    setCreateOpen(
                        false
                    )
                }
            >
                <EmployeeForm
                    offices={offices.filter(
                        office =>
                            office.isActive
                    )}
                    onSubmit={
                        handleCreate
                    }
                    onCancel={() =>
                        setCreateOpen(
                            false
                        )
                    }
                />
            </Modal>

            <Modal
                open={
                    Boolean(
                        editEmployee
                    )
                }
                title="Edit Employee"
                onClose={() =>
                    setEditEmployee(
                        null
                    )
                }
            >
                <EmployeeForm
                    key={
                        editEmployee?.id
                    }
                    employee={
                        editEmployee
                    }
                    offices={
                        offices
                    }
                    onSubmit={
                        handleUpdate
                    }
                    onCancel={() =>
                        setEditEmployee(
                            null
                        )
                    }
                />
            </Modal>

            <Modal
                open={
                    Boolean(
                        detailEmployee
                    )
                }
                title="Detail Employee"
                onClose={() =>
                    setDetailEmployee(
                        null
                    )
                }
            >
                <EmployeeDetail
                    employee={
                        detailEmployee
                    }
                />
            </Modal>

            <ConfirmDialog
                open={
                    Boolean(
                        deactivateEmployee
                    )
                }
                title="Nonaktifkan Employee?"
                message={`Employee ${deactivateEmployee?.name ?? ''} tidak akan dapat login setelah dinonaktifkan.`}
                confirmLabel="Nonaktifkan"
                loading={
                    deactivating
                }
                onClose={() =>
                    setDeactivateEmployee(
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