import {
    useState
} from 'react';

import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

import {
    handleApiError
} from '../../utils/errorHandler';

export default function EmployeeForm({
    employee,
    offices = [],
    onSubmit,
    onCancel
}) {
    const isEdit =
        Boolean(employee);

    const [
        values,
        setValues
    ] =
        useState({
            employeeId:
                employee?.employeeId ??
                '',

            name:
                employee?.name ??
                '',

            email:
                employee?.email ??
                '',

            password:
                '',

            officeId:
                employee?.officeId ??
                '',

            isActive:
                employee?.isActive ??
                true
        });

    const [
        error,
        setError
    ] =
        useState('');

    const [
        loading,
        setLoading
    ] =
        useState(false);

    const setField =
        (field, value) => {
            setValues(
                previous => ({
                    ...previous,
                    [field]:
                        value
                })
            );
        };

    const handleSubmit =
        async event => {
            event.preventDefault();

            setError('');

            if (
                !values.employeeId.trim() ||
                !values.name.trim() ||
                !values.email.trim()
            ) {
                setError(
                    'Employee ID, nama, dan email wajib diisi.'
                );

                return;
            }

            if (
                !isEdit &&
                !values.password
            ) {
                setError(
                    'Password wajib diisi untuk employee baru.'
                );

                return;
            }

            if (!values.officeId) {
                setError(
                    'Kantor employee wajib dipilih.'
                );

                return;
            }

            setLoading(true);

            try {
                const payload = {
                    employee_id:
                        values.employeeId
                            .trim(),

                    name:
                        values.name
                            .trim(),

                    email:
                        values.email
                            .trim()
                            .toLowerCase(),

                    role:
                        'EMPLOYEE',

                    office_id:
                        values.officeId,

                    is_active:
                        values.isActive
                };

                if (
                    values.password
                ) {
                    payload.password =
                        values.password;
                }

                await onSubmit(
                    payload
                );
            } catch (
            requestError
            ) {
                setError(
                    handleApiError(
                        requestError,
                        isEdit
                            ? 'Employee gagal diperbarui.'
                            : 'Employee gagal dibuat.'
                    )
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <form
            className="
        space-y-4
      "
            onSubmit={
                handleSubmit
            }
        >
            {error && (
                <div
                    className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-3
            text-sm
            text-danger
          "
                >
                    {error}
                </div>
            )}

            <div
                className="
          grid
          gap-4
          sm:grid-cols-2
        "
            >
                <Input
                    id="employee-id"
                    label="Employee ID"
                    value={
                        values.employeeId
                    }
                    onChange={
                        event =>
                            setField(
                                'employeeId',
                                event.target.value
                            )
                    }
                    required
                />

                <Input
                    id="employee-name"
                    label="Nama Employee"
                    value={
                        values.name
                    }
                    onChange={
                        event =>
                            setField(
                                'name',
                                event.target.value
                            )
                    }
                    required
                />
            </div>

            <Input
                id="employee-email"
                label="Email"
                type="email"
                value={
                    values.email
                }
                onChange={
                    event =>
                        setField(
                            'email',
                            event.target.value
                        )
                }
                required
            />

            <Input
                id="employee-password"
                label={
                    isEdit
                        ? 'Password Baru (opsional)'
                        : 'Password'
                }
                type="password"
                value={
                    values.password
                }
                onChange={
                    event =>
                        setField(
                            'password',
                            event.target.value
                        )
                }
                required={!isEdit}
                autoComplete="new-password"
            />

            <Select
                id="employee-office"
                label="Kantor"
                value={
                    values.officeId
                }
                onChange={
                    event =>
                        setField(
                            'officeId',
                            event.target.value
                        )
                }
                required
            >
                <option value="">
                    Pilih kantor
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
                id="employee-status"
                label="Status Akun"
                value={
                    values.isActive
                        ? 'true'
                        : 'false'
                }
                onChange={
                    event =>
                        setField(
                            'isActive',
                            event.target.value ===
                            'true'
                        )
                }
            >
                <option value="true">
                    Aktif
                </option>

                <option value="false">
                    Tidak Aktif
                </option>
            </Select>

            <div
                className="
          flex
          flex-col-reverse
          gap-2
          pt-3
          sm:flex-row
          sm:justify-end
        "
            >
                <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    onClick={onCancel}
                >
                    Batal
                </Button>

                <Button
                    type="submit"
                    loading={loading}
                >
                    {isEdit
                        ? 'Simpan Perubahan'
                        : 'Tambah Employee'}
                </Button>
            </div>
        </form>
    );
}