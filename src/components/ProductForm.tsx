import React, { useState, Fragment, ChangeEvent, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Size {
    name: string;
    stock: string;
}

interface Variation {
    color: string;
    size: Size[];
    image?: File | null;
}

interface FormData {
    sku: string;
    name: string;
    price: number;
    discount: number;
    offerEnd: Date | null;
    new: boolean;
    rating: number;
    saleCount: number;
    category: string[];
    tag: string[];
    variation: Variation[];
    shortDescription: string;
    fullDescription: string;
    productImages?: File[];
}

const ProductForm: React.FC = () => {
    const { pathname } = useLocation();

    const initialFormData: FormData = {
        sku: 'asdf123',
        name: '',
        price: 0,
        discount: 0,
        offerEnd: null,
        new: false,
        rating: 0,
        saleCount: 0,
        category: [],
        tag: [],
        variation: [
            {
                color: '',
                size: [{ name: '', stock: '' }],
            },
        ],
        shortDescription: '',
        fullDescription: '',
    };

    const initialCategories = ['fashion', 'men'];

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'new' ? value === 'true' : value,
        }));
    };

    const handleVariationImageChange = (variationIndex: number, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prevData => {
                const updatedVariation = [...prevData.variation];
                updatedVariation[variationIndex].image = file;
                return {
                    ...prevData,
                    variation: updatedVariation
                };
            });
        }
    };

    const handleMultipleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const fileData: File[] = Array.from(files);
            setFormData((prevData) => ({
                ...prevData,
                productImages: fileData,
            }));
        }
    };

    const handleVariationChange = (
        e: ChangeEvent<HTMLInputElement>,
        variationIndex: number,
        sizeIndex: number,
        property: keyof Size
    ) => {
        const { value } = e.target;
        setFormData((prevData) => {
            const updatedVariation = [...prevData.variation];
            const updatedSizes = updatedVariation[variationIndex].size.map((size, index) => {
                if (index === sizeIndex) {
                    return { ...size, [property]: value };
                }
                return size;
            });
            updatedVariation[variationIndex] = {
                ...updatedVariation[variationIndex],
                size: updatedSizes
            };
            return {
                ...prevData,
                variation: updatedVariation,
            };
        });
    };
    

    const handleAddSize = (variationIndex: number) => {
        setFormData((prevData) => {
            const updatedVariation = [...prevData.variation];
            const newSizeArray = [...updatedVariation[variationIndex].size, { name: '', stock: '' }];
            updatedVariation[variationIndex] = {
                ...updatedVariation[variationIndex],
                size: newSizeArray
            };
            return {
                ...prevData,
                variation: updatedVariation,
            };
        });
    };
    

    const handleCategorySelection = (selectedCategory: string | null) => {
        if (selectedCategory) {
            setFormData((prevData) => ({
                ...prevData,
                category: [...prevData.category, selectedCategory],
            }));
        }
    };

    const handleTagSelection = (selectedTag: string | null) => {
        if (selectedTag) {
            setFormData((prevData) => ({
                ...prevData,
                tag: [...prevData.tag, selectedTag],
            }));
        }
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        setFormData((prevData) => ({
            ...prevData,
            offerEnd: date,
        }));
    };

    const handleColorChange = (e: ChangeEvent<HTMLInputElement>, variationIndex: number) => {
        const { value } = e.target;
        setFormData((prevData) => {
            const updatedVariation = [...prevData.variation];
            updatedVariation[variationIndex].color = value;
            return {
                ...prevData,
                variation: updatedVariation,
            };
        });
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formData.variation.forEach((variation) => {
            if (variation.image) {
                formDataToSend.append('variationImage', variation.image);
                variation.image = null;
            }
        });

        if (formData.productImages && formData.productImages.length > 0) {
            formData.productImages.forEach((image) => {
                formDataToSend.append('productImages', image);
            });
        }

        const { productImages, ...newObject } = formData;
        formDataToSend.append('product', JSON.stringify(newObject));

        try {
            const response = await fetch('http://localhost:8081/api/products', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                setFormData(initialFormData);
                setSelectedDate(null);
                console.log('Data saved successfully!');
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error while saving form data to the server', error);
        }
    };

    return (
        <Fragment>
            <div className='flex justify-center'>
                <form className='bg-white p-6 rounded-lg shadow-md w-full max-w-lg' onSubmit={handleSave}>
                    <div className='mb-4'>
                        <label htmlFor='name' className='block text-gray-700'>Product Name:</label>
                        <input
                            type='text'
                            placeholder='Product Name'
                            id='name'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor='price' className='block text-gray-700'>Price:</label>
                        <input
                            type='number'
                            placeholder='Price'
                            id='price'
                            name='price'
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor='discount' className='block text-gray-700'>Discount:</label>
                        <input
                            type='number'
                            placeholder='Discount'
                            id='discount'
                            name='discount'
                            value={formData.discount}
                            onChange={handleChange}
                            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor='rating' className='block text-gray-700'>Rating:</label>
                        <input
                            type='number'
                            placeholder='Rating'
                            id='rating'
                            name='rating'
                            value={formData.rating}
                            onChange={handleChange}
                            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor='saleCount' className='block text-gray-700'>Sale Count:</label>
                        <input
                            type='text'
                            placeholder='Sale Count'
                            id='saleCount'
                            name='saleCount'
                            value={formData.saleCount}
                            onChange={handleChange}
                            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor='offerEnd' className='block text-gray-700'>Offer End Date:</label>
                        <DatePicker
                            placeholderText='Select Date'
                            selected={selectedDate}
                            onChange={handleDateChange}
                            showTimeSelect
                            timeIntervals={15}
                            timeCaption='Time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                            required
                        />

                    </div>

                    <div className='mb-4'>
                        <label htmlFor='shortDescription' className='block text-gray-700'>Short Description:</label>
                        <input
                            type='text'
                            placeholder='Short Description'
                            id='shortDescription'
                            name='shortDescription'
                            value={formData.shortDescription}
                            onChange={handleChange}
                            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor='fullDescription' className='block text-gray-700'>Full Description:</label>
                        <input
                            type='text'
                            placeholder='Full Description'
                            id='fullDescription'
                            name='fullDescription'
                            value={formData.fullDescription}
                            onChange={handleChange}
                            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor='productImages' className='block text-gray-700'>Product Images:</label>
                        <input
                            type='file'
                            multiple
                            id='productImages'
                            name='productImages'
                            onChange={handleMultipleImagesChange}
                            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>

                    {formData.variation.map((variation, variationIndex) => (
                        <div key={variationIndex} className='mb-4'>
                            <label htmlFor={`variation${variationIndex}Color`} className='block text-gray-700'>Variation Color:</label>
                            <input
                                type='text'
                                placeholder='Color'
                                id={`variation${variationIndex}Color`}
                                name={`variation${variationIndex}Color`}
                                value={variation.color}
                                onChange={(e) => handleColorChange(e, variationIndex)}
                                className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            />
                            <label htmlFor={`variation${variationIndex}Image`} className='block text-gray-700'>Variation Image:</label>
                            <input
                                type='file'
                                id={`variation${variationIndex}Image`}
                                name={`variation${variationIndex}Image`}
                                onChange={(e) => handleVariationImageChange(variationIndex, e)}
                                className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            />

                            <button
                                type="button"
                                onClick={() => handleAddSize(variationIndex)}
                                className="text-blue-500 hover:underline"
                            >
                                Add Size
                            </button>

                            {variation.size.map((size, sizeIndex) => (
                                <div key={sizeIndex} className='mb-2'>
                                    <div className="flex justify-between">
                                        <div>
                                            <label htmlFor={`variation${variationIndex}Size${sizeIndex}Name`} className='block text-gray-700'>Size Name:</label>
                                            <input
                                                type='text'
                                                placeholder='Size'
                                                id={`variation${variationIndex}Size${sizeIndex}Name`}
                                                name={`variation${variationIndex}Size${sizeIndex}Name`}
                                                value={size.name}
                                                onChange={(e) => handleVariationChange(e, variationIndex, sizeIndex, 'name')}
                                                className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor={`variation${variationIndex}Size${sizeIndex}Stock`} className='block text-gray-700'>Stock:</label>
                                            <input
                                                type='text'
                                                placeholder='Stock'
                                                id={`variation${variationIndex}Size${sizeIndex}Stock`}
                                                name={`variation${variationIndex}Size${sizeIndex}Stock`}
                                                value={size.stock}
                                                onChange={(e) => handleVariationChange(e, variationIndex, sizeIndex, 'stock')}
                                                className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    ))}

                    <div className='mb-4'>
                        <label htmlFor='category' className='block text-gray-700'>Category:</label>
                        <input
                            type='text'
                            placeholder='Category'
                            id='category'
                            name='category'
                            value={formData.category.join(', ')}
                            readOnly
                            className='mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                        {initialCategories.map((category, index) => (
                            <button
                                type='button'
                                key={index}
                                onClick={() => handleCategorySelection(category)}
                                className='mt-2 mr-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className='mb-4'>
                        <label htmlFor='tag' className='block text-gray-700'>Tags:</label>
                        <input
                            type='text'
                            placeholder='Tags'
                            id='tag'
                            name='tag'
                            value={formData.tag.join(', ')}
                            readOnly
                            className='mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>

                    <button
                        type='submit'
                        className='w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600'
                    >
                        Save
                    </button>
                </form>
            </div>
        </Fragment>
    );
};

export default ProductForm;
