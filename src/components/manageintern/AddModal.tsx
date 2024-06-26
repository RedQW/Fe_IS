import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
  Input,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "@/components/css/manageintern/ModalBox.css";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "../ui/use-toast";
import internApiRequest from "@/apiRequests/intern";
import { CreateInternType } from "@/schemaValidations/intern.schema";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { SelectChangeEvent } from "@mui/material";
import { TermListResType } from "@/schemaValidations/term.schema";
import termApiRequest from "@/apiRequests/term";
interface AddModalProps {
  onClose: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<CreateInternType>({
    address: "",
    avatar: "",
    "date-of-birth": "",
    email: "",
    gender: "male",
    "ojt-id": 1,
    password: "",
    "phone-number": "",
    "student-code": "",
    "user-name": "",
  });

  const [errors, setErrors] = useState({
    password: "",
    email: "",
    "phone-number": "",
    gender: "",
    "user-name": "",
    "student-code": "",
    "date-of-birth": "",
    address: "",
  });

  const [filterOjt, setFilterOjt] = useState<TermListResType>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { payload } = await termApiRequest.getListTerm(null, null, null);
        setFilterOjt(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      if (value.length < 6) {
        setErrors((prev) => ({
          ...prev,
          password: "Mật khẩu phải lớn hơn 6 kí tự",
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: "Email không hợp lệ" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    if (name === "phone-number") {
      if (value.length < 10 || value.length > 11) {
        setErrors((prev) => ({
          ...prev,
          "phone-number": "Số điện thoại phải đủ 10 đến 11 số",
        }));
      } else {
        setErrors((prev) => ({ ...prev, "phone-number": "" }));
      }
    }

    if (name === "user-name") {
      if (value.length < 4) {
        setErrors((prev) => ({
          ...prev,
          "user-name": "Tên người dùng phải lớn hơn 4 kí tự",
        }));
      } else {
        setErrors((prev) => ({ ...prev, "user-name": "" }));
      }
    }

    if (name === "student-code") {
      if (value.length < 4) {
        setErrors((prev) => ({
          ...prev,
          "student-code": "Mã sinh viên phải lớn hơn 4 kí tự",
        }));
      } else {
        setErrors((prev) => ({ ...prev, "student-code": "" }));
      }
    }

    if (name === "date-of-birth") {
      if (!value) {
        setErrors((prev) => ({
          ...prev,
          "date-of-birth": "Ngày sinh không được để trống",
        }));
      } else {
        setErrors((prev) => ({ ...prev, "date-of-birth": "" }));
      }
    }

    if (name === "address") {
      if (!value) {
        setErrors((prev) => ({
          ...prev,
          address: "Địa chỉ không được để trống",
        }));
      } else {
        setErrors((prev) => ({ ...prev, address: "" }));
      }
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "gender" && value) {
      setErrors((prev) => ({ ...prev, gender: "" }));
    }
  };

  const handleDateChange = (name: string, date: Dayjs | null) => {
    setFormData({
      ...formData,
      [name]: date ? date.format("YYYY-MM-DD") : "",
    });
  };

  const handleOjtIdChange = (e: SelectChangeEvent<number>) => {
    const value = e.target.value as number;
    setFormData({
      ...formData,
      "ojt-id": value,
    });
  };

  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    // Validate all fields before submitting
    let valid = true;
    const newErrors = { ...errors };

    if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải lớn hơn 6 kí tự";
      valid = false;
    } else {
      newErrors.password = "";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      valid = false;
    } else {
      newErrors.email = "";
    }

    if (
      formData["phone-number"].length < 10 ||
      formData["phone-number"].length > 11
    ) {
      newErrors["phone-number"] = "Số điện thoại phải đủ 10 đến 11 số";
      valid = false;
    } else {
      newErrors["phone-number"] = "";
    }

    if (formData["user-name"].length < 4) {
      newErrors["user-name"] = "Tên người dùng phải lớn hơn 4 kí tự";
      valid = false;
    } else {
      newErrors["user-name"] = "";
    }

    if (formData["student-code"].length < 4) {
      newErrors["student-code"] = "Mã sinh viên phải lớn hơn 4 kí tự";
      valid = false;
    } else {
      newErrors["student-code"] = "";
    }

    if (!formData.gender) {
      newErrors.gender = "Giới tính không được để trống";
      valid = false;
    } else {
      newErrors.gender = "";
    }

    if (!formData["date-of-birth"]) {
      newErrors["date-of-birth"] = "Ngày sinh không được để trống";
      valid = false;
    } else {
      newErrors["date-of-birth"] = "";
    }

    if (!formData.address) {
      newErrors.address = "Địa chỉ không được để trống";
      valid = false;
    } else {
      newErrors.address = "";
    }

    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);
    const formattedData = {
      ...formData,
      "date-of-birth": formData["date-of-birth"]
        ? dayjs(formData["date-of-birth"]).format("YYYY-MM-DD")
        : "",
    };
    console.log("Form Data:", formattedData);

    try {
      const { payload } = await internApiRequest.createIntern(formattedData);
      toast({
        title: payload.message,
        duration: 2000,
        variant: "success",
      });
      console.log(payload);
      onClose();
    } catch (error: any) {
      const errorRes = { error };
      const errorMessage =
        errorRes.error.payload.message || "Đã xảy ra lỗi, vui lòng thử lại";
      if (errorRes.error.payload.log.includes("duplicate data")) {
        const duplicates = errorRes.error.payload.log
          .match(/\[(.*?)\]/)[1]
          .split(", ");
        const newFieldErrors = { ...errors };

        duplicates.forEach((field: string) => {
          switch (field) {
            case "email":
              newFieldErrors.email = "Email đã tồn tại hoặc không hợp lệ";
              break;
            case "phone-number":
              newFieldErrors["phone-number"] =
                "Số điện thoại đã tồn tại hoặc không hợp lệ";
              break;
            case "user-name":
              newFieldErrors["user-name"] = "Tên người dùng đã tồn tại";
              break;
            case "student-code":
              newFieldErrors["student-code"] = "Mã sinh viên đã tồn tại";
              break;
            default:
              break;
          }
        });

        setErrors(newFieldErrors);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="modal-box">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Tạo thực tập sinh mới
        </Typography>
        <FormControl fullWidth>
          <Grid container spacing={2} marginY={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                name="user-name"
                size="small"
                value={formData["user-name"]}
                onChange={handleChange}
                error={Boolean(errors["user-name"])}
                helperText={errors["user-name"]}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Mật khẩu"
                name="password"
                size="small"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                size="small"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Mã sinh viên"
                name="student-code"
                size="small"
                value={formData["student-code"]}
                onChange={handleChange}
                error={Boolean(errors["student-code"])}
                helperText={errors["student-code"]}
              />
            </Grid>
            <Grid item xs={4}>
              <Select
                name="ojt-id"
                value={formData["ojt-id"]}
                onChange={handleOjtIdChange}
                displayEmpty
                style={{ width: "100%" }}
                size="small"
              >
                <MenuItem value="" disabled>
                  <em>OJT Semester</em>
                </MenuItem>
                {filterOjt?.data.map((semester) => (
                  <MenuItem key={semester.id} value={semester.id}>
                    {semester.semester}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth error={Boolean(errors.gender)}>
                <InputLabel id="gender-label" shrink>
                  Giới tính
                </InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender-select"
                  name="gender"
                  value={formData.gender}
                  size="small"
                  onChange={handleSelectChange}
                  label="Giới tính"
                  displayEmpty
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                </Select>
                <FormHelperText>{errors.gender}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone-number"
                size="small"
                value={formData["phone-number"]}
                onChange={handleChange}
                error={Boolean(errors["phone-number"])}
                helperText={errors["phone-number"]}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Địa chỉ"
                size="small"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={Boolean(errors.address)}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                format="DD/MM/YYYY"
                value={
                  formData["date-of-birth"]
                    ? dayjs(formData["date-of-birth"])
                    : null
                }
                onChange={(date) => handleDateChange("date-of-birth", date)}
                slotProps={{
                  textField: {
                    label: "Ngày sinh",
                    fullWidth: true,
                    size: "small",
                    error: Boolean(errors["date-of-birth"]),
                    helperText: errors["date-of-birth"],
                  },
                }}
              />
            </Grid>
          </Grid>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            marginTop={2}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleAdd}
              startIcon={<AddIcon />}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </Button>
          </Box>
        </FormControl>
      </Box>
    </LocalizationProvider>
  );
};

export default AddModal;
