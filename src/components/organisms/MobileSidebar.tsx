import React, { useState } from "react";
import { Drawer, Button, Checkbox, InputNumber, Slider } from "antd";

const categories = [
    {
      name: 'Pria',
      subcategories: [
        {
          name: 'Kemeja',
          subcategories: [],
        },
        {
          name: 'T-shirt',
          subcategories: [],
        },
        {
          name: 'Jaket',
          subcategories: [],
        },
        {
          name: 'Celana',
          subcategories: [],
        },
      ],
    },
    {
      name: 'Wanita',
      subcategories: [
        {
          name: 'Kemeja',
          subcategories: [],
        },
        {
          name: 'T-shirt',
          subcategories: [],
        },
        {
          name: 'Jaket',
          subcategories: [],
        },
        {
          name: 'Celana dan Rok',
          subcategories: [],
        },
      ],
    },
    {
      name: 'Sepatu',
      subcategories: [
        {
          name: 'Lari',
          subcategories: [],
        },
        {
          name: 'Training',
          subcategories: [],
        },
        {
          name: 'Casual',
          subcategories: [],
        },
        {
          name: 'Sandal',
          subcategories: [],
        },
      ],
    },
  ];

const sizes = ["S", "M", "L", "XL"];
const colors = [
  { name: "Putih", hex: "#ffffff" },
  { name: "Hitam", hex: "#000000" },
  { name: "Biru", hex: "#0000ff" },
  { name: "Merah", hex: "#ff0000" },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: any) => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, onFilterChange }) => {
  const [filters, setFilters] = useState<{
    category: string[];
    priceRange: [number, number];
    size: string[];
    color: string[];
  }>({
    category: [],
    priceRange: [0, 200000],
    size: [],
    color: [],
  });

  const handleFilterChange = (type: string, value: any) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    onClose();
  };

  return (
    <Drawer title="Filter Produk" placement="right" width={280} onClose={onClose} open={isOpen}>
      {/* Kategori */}
      <h4>Kategori</h4>
      {categories.map((category) => (
          <div key={category.name}>
            <Checkbox
              checked={filters.category.includes(category.name)}
              onChange={(e) => {
                const checked = e.target.checked;
                let updatedCategories = [...filters.category];
      
                if (checked) {
                  updatedCategories.push(category.name);
                  category.subcategories.forEach((sub) => {
                    updatedCategories.push(`${category.name}-${sub.name}`);
                    sub.subcategories.forEach((subsub) =>
                      updatedCategories.push(`${category.name}-${sub.name}-${subsub}`)
                    );
                  });
                } else {
                  updatedCategories = updatedCategories.filter(
                    (c) =>
                      c !== category.name &&
                      !category.subcategories.some((sub) =>
                        [sub.name, ...sub.subcategories].map((s) => `${category.name}-${s}`).includes(c)
                      )
                  );
                }
      
                handleFilterChange('category', updatedCategories);
              }}
            >
              {category.name}
            </Checkbox>
      
            {filters.category.includes(category.name) && (
              <div style={{ marginLeft: '15px' }}>
                {category.subcategories.map((sub) => (
                  <div key={`${category.name}-${sub.name}`}>
                    <Checkbox
                      checked={filters.category.includes(`${category.name}-${sub.name}`)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        let updatedCategories = [...filters.category];
      
                        if (checked) {
                          updatedCategories.push(`${category.name}-${sub.name}`);
                          sub.subcategories.forEach((subsub) =>
                            updatedCategories.push(`${category.name}-${sub.name}-${subsub}`)
                          );
                        } else {
                          updatedCategories = updatedCategories.filter(
                            (c) =>
                              c !== `${category.name}-${sub.name}` &&
                              !sub.subcategories.map((s) => `${category.name}-${sub.name}-${s}`).includes(c)
                          );
                        }
      
                        handleFilterChange('category', updatedCategories);
                      }}
                    >
                      {sub.name}
                    </Checkbox>
      
                    {filters.category.includes(`${category.name}-${sub.name}`) && (
                      <div style={{ marginLeft: '15px' }}>
                        {sub.subcategories.map((subsub) => (
                          <Checkbox
                            key={`${category.name}-${sub.name}-${subsub}`}
                            checked={filters.category.includes(`${category.name}-${sub.name}-${subsub}`)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              let updatedCategories = [...filters.category];
      
                              if (checked) {
                                updatedCategories.push(`${category.name}-${sub.name}-${subsub}`);
                              } else {
                                updatedCategories = updatedCategories.filter(
                                  (c) => c !== `${category.name}-${sub.name}-${subsub}`
                                );
                              }
      
                              handleFilterChange('category', updatedCategories);
                            }}
                          >
                            {subsub}
                          </Checkbox>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

      {/* Harga */}
      <h4 style={{ marginTop: "10px" }}>Harga</h4>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <InputNumber
          min={0}
          max={1000000}
          value={filters.priceRange[0]}
          onChange={(value) => handleFilterChange("priceRange", [value || 0, filters.priceRange[1]])}
          style={{ width: "80px" }}
        />
        <span>-</span>
        <InputNumber
          min={0}
          max={1000000}
          value={filters.priceRange[1]}
          onChange={(value) => handleFilterChange("priceRange", [filters.priceRange[0], value || 200000])}
          style={{ width: "80px" }}
        />
      </div>
      <Slider
        range
        min={0}
        max={1000000}
        value={filters.priceRange}
        onChange={(value) => handleFilterChange("priceRange", value)}
        style={{ marginTop: "10px" }}
      />

      {/* Ukuran */}
      <h4 style={{ marginTop: "10px" }}>Ukuran</h4>
      {sizes.map((size) => (
        <Checkbox
          key={size}
          checked={filters.size.includes(size)}
          onChange={(e) =>
            handleFilterChange(
              "size",
              e.target.checked ? [...filters.size, size] : filters.size.filter((s) => s !== size)
            )
          }
        >
          {size}
        </Checkbox>
      ))}

       {filters.category.includes("Sepatu") && (
                  <div>
                    <h4 style={{ marginTop: "10px", fontSize: "14px" }}>Ukuran Sepatu</h4>
                    <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #ddd", padding: "5px" }}>
                      {[36, 37, 38, 39, 40, 41, 42, 43, 44, 45].map((size) => (
                        <Checkbox
                          key={size}
                          checked={filters.size.includes(size.toString())}
                          onChange={(e) =>
                            handleFilterChange(
                              "size",
                              e.target.checked ? [...filters.size, size.toString()] : filters.size.filter((s) => s !== size.toString())
                            )
                          }
                        >
                          {size}
                        </Checkbox>
                      ))}
                    </div>
                  </div>
                )}

      {/* Warna */}
      <h4 style={{ marginTop: "10px" }}>Warna</h4>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
        {colors.map((color) => (
          <div
            key={color.name}
            onClick={() =>
              handleFilterChange(
                "color",
                filters.color.includes(color.name)
                  ? filters.color.filter((c) => c !== color.name)
                  : [...filters.color, color.name]
              )
            }
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: color.hex,
              borderRadius: "50%",
              cursor: "pointer",
              border: filters.color.includes(color.name) ? "2px solid #000" : "1px solid #ddd",
            }}
          />
        ))}
      </div>

      {/* Tombol Terapkan */}
      <Button type="primary" className="mt-5 bg-[#7f0353]" onClick={handleApplyFilters} block>
        Terapkan
      </Button>
    </Drawer>
  );
};

export default MobileSidebar;
