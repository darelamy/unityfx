import React from "react";
import styles from "./UpdateAvatarPopup.module.scss";
import axios from "axios";
import { useSession } from "next-auth/react";
import { PenIcon } from "@/ui/icons/PenIcon";
import { CrossIcon } from "@/icons/CrossIcon";

interface UpdateAvatarModalProps {
  handleChangeAvatar: (avatarUrl: string) => void;
}

export const UpdateAvatarModal: React.FC<UpdateAvatarModalProps> = ({
  handleChangeAvatar,
}) => {
  const [attachedImageFormData, setAttachedImageFormData] = React.useState([]);
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = React.useState(false);
  const [attachedImage, setAttachedImage] = React.useState<File>();
  const [isSaveImage, setIsSaveImage] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [preview, setPreview] = React.useState("");

  const attachedImageRef = React.useRef<HTMLInputElement>(null);

  const { data: session, status, update } = useSession();

  const handleChangeImage = async (files: FileList | null) => {
    try {
      if (!files) return;

      const formData: any = new FormData();

      formData.append("file", files[0]);
      formData.append("upload_preset", "ppioffkm");

      setAttachedImageFormData(formData);

      setAttachedImage(files[0]);

      files && setIsSaveImage(true);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmitAttachedImage = async () => {
    try {
      setIsUploading(true);

      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/darelamy/image/upload",
        attachedImageFormData
      );

      handleChangeAvatar(data.secure_url);

      await update({
        avatarUrl: data.secure_url,
      });

      await axios.patch("/api/upload-avatar", { avatarUrl: data.secure_url });

      setIsUploading(false);

      return data;
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaveImage(false);
      setIsUploading(false);
      setIsChangeAvatarOpen(false);
    }
  };

  React.useEffect(() => {
    if (isSaveImage) setIsChangeAvatarOpen(true);
  }, [attachedImage]);

  React.useEffect(() => {
    if (attachedImage) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result as string);
      };

      reader.readAsDataURL(attachedImage);
    } else setPreview("");
  }, [attachedImage]);

  return (
    <>
      <button
        type="button"
        className={`${styles.changeAvatarButton} flex items-center justify-center`}
        onClick={() => attachedImageRef?.current?.click()}
      >
        <PenIcon />
      </button>
      <input
        accept="image/*"
        ref={attachedImageRef}
        type="file"
        onChange={(e) => handleChangeImage(e.target.files)}
        hidden
      />
      {isChangeAvatarOpen && (
        <div className={styles.modalOverlay}>
          <div>
            <div className={styles.modalContent}>
              <div
                className={styles.closeButton}
                onClick={() => setIsChangeAvatarOpen(false)}
              >
                <CrossIcon />
              </div>
              <div className="flex flex-col items-center justify-center">
                {preview && (
                  <img
                    className={styles.preview}
                    src={preview}
                    alt="image preview"
                  />
                )}
                <button
                  type="button"
                  onClick={onSubmitAttachedImage}
                  className={`${styles.submitButton} flex items-center justify-center`}
                  disabled={isUploading || !preview}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
