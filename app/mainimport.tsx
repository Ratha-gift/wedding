
import axios from "axios";

import { useEffect, useState } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { MdOutlineLightMode } from "react-icons/md";
import { RiMoonClearLine } from "react-icons/ri";
import { RiFileExcel2Line } from "react-icons/ri";

import Table from "@/app/Components/Table/table";
import MyPagination from "@/app/Components/Pagination/pagination";
import Modalcreate from "@/app/Components/Modal/modal";
import Link from "antd/es/typography/Link";
import DrawerFilter from "@/app/Components/Button/filter";
import DropdownProfile from "@/app/Components/Dropdown/profile";
import SearchInput from "@/app/Components/input/input";
import { useAuth } from "./src/lib/useAuth";

import { redirect } from "next/dist/client/components/navigation";

