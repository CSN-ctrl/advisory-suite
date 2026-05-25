import { EditableImage } from "@/components/edit-mode/EditableImage";
import { usePageEditing } from "@/hooks/use-page-editing";

interface CmsImageProps {
  page: string;
  section: string;
  urlKey: string;
  altKey: string;
  defaultSrc: string;
  defaultAlt: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
}

export function CmsImage({
  page,
  section,
  urlKey,
  altKey,
  defaultSrc,
  defaultAlt,
  className,
  imgClassName,
  loading,
}: CmsImageProps) {
  const { bind } = usePageEditing(page);

  return (
    <EditableImage
      defaultSrc={defaultSrc}
      srcBind={bind(section, urlKey, "")}
      altBind={bind(section, altKey, defaultAlt)}
      className={className}
      imgClassName={imgClassName}
      loading={loading}
    />
  );
}
