import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/types";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl"
    >
      <Link href={`/marketplace/product/${product.id}`} className="block">
        <div className="relative aspect-video w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/800x600/f0f0f0/333?text=Image+Not+Found";
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-600">
            {product.description.length > 50
              ? `${product.description.substring(0, 50)}...`
              : product.description}
          </p>
          <p className="mt-2 font-medium text-gray-900">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}