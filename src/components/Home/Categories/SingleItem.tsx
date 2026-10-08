import { Category } from "@/redux/features/categories-slice";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setSelectedCategory } from "@/redux/features/categories-slice";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/TranslationContext";

const SingleItem = ({ item }: { item: Category }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { locale } = useTranslation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(setSelectedCategory(item.id));
    router.push("/products");
  };

  return (
    <a href="/products" onClick={handleClick} className="group flex flex-col items-center">
      <div className="max-w-[130px] w-full bg-[#F2F3F8] h-32.5 rounded-full flex items-center justify-center mb-4">
        {item.image_url && (
          <Image src={item.image_url} alt="Category" width={82} height={62} />
        )}
      </div>

      <div className="flex justify-center">
        <h3 className="inline-block font-medium text-center text-dark bg-gradient-to-r from-primary to-primary bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-primary">
          {item[`name_${locale}`] || item.name}
        </h3>
      </div>
    </a>
  );
};

export default SingleItem;
