"use client";

import React, { useState } from "react";
import { Button, ConfigProvider, Drawer, Input, DatePicker, Radio } from "antd";
import { FaFilter } from "react-icons/fa";

const DrawerFilter: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: "inherit",
                    colorPrimary: "#E11D48",
                },
                components: {
                    Button: {
                        colorPrimary: '#E11D48',
                        borderRadius: 6,
                        controlHeight: 40,
                    },
                },

            }}

        >
            {/* Filter Button */}
            <Button
                type="primary"
                className="flex items-center gap-2"
                onClick={() => setOpen(true)}
            >
                <FaFilter size={22} />
                <span className="font-Kantumruy text-[16px] font-medium">
                    ច្រោះ
                </span>
            </Button>

            {/* Drawer */}
            <Drawer
                placement="right"
                open={open}
                onClose={() => setOpen(false)}
                width={360}
                closable={false}
                styles={{
                    body: {
                        backgroundColor: "#F2F2F2",
                        padding: 20,
                    },
                }}
            >
                {/* Custom Header */}
                {/* <div className="mb-4">
          <h2 className="text-lg font-semibold text-red-600">ច្រោះ</h2>
        </div> */}

                {/* Filter Form */}
                <div className="space-y-4">
                    <div>
                        <label className="text-red-600 font-medium text-base">ឈ្មោះ</label>
                        <Input placeholder="បញ្ចូលឈ្មោះ..." />
                    </div>

                    <div>
                        <label className="text-red-600 font-medium text-base">កាលបរិច្ឆេទ</label>
                        <div className="flex gap-2">
                            <DatePicker className="w-full" />
                            <DatePicker className="w-full" />
                        </div>
                    </div>

                    <div>
                        <label className="text-red-600 font-medium text-base">លេខទូរស័ព្ទ</label>
                        <Input placeholder="បញ្ចូលលេខទូរស័ព្ទ..." />
                    </div>

                    <div>
                        <label className="text-red-600 font-medium text-base">ទីតាំង</label>
                        <Input placeholder="បញ្ចូលទីតាំង..." />
                    </div>

                    <div>
                        <label className="text-red-600 font-medium text-base">ស្ថានភាព:</label>
                        <Radio.Group className="flex gap-4 mt-2">
                            <Radio value={1}>ខាងប្រុស</Radio>
                            <Radio value={2}>ខាងស្រី</Radio>
                            <Radio value={3}>ផ្សេងៗ</Radio>
                        </Radio.Group>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 mt-6">
                    <Button className="w-1/2">បោះបង់</Button>
                    <Button type="primary" className="w-1/2">
                        អនុវត្តន៍
                    </Button>
                </div>
            </Drawer>
        </ConfigProvider>
    );
};

export default DrawerFilter;
