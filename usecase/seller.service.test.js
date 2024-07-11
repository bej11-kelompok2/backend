const SellerService = require("./seller.service");

// Mocking SellerRepository
jest.mock("../repository/seller.repository", () => {
  return jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createItem: jest.fn(),
    findItemById: jest.fn(),
    findAllItems: jest.fn(),
  }));
});

jest.mock("../util/cloudinary", () => {
  const mockUploadResult = { secure_url: "https://mock-url/image.jpg" };

  return {
    uploader: {
      upload_stream: jest.fn((callback) => {
        const mockStream = {
          end: () => {
            callback(null, mockUploadResult);
          },
        };
        return mockStream;
      }),
    },
  };
});

describe("SellerService", () => {
  let sellerService;

  // Initialize SellerService before each test
  beforeEach(() => {
    sellerService = new SellerService();
  });

  // Test findById method
  describe("findById", () => {
    it("should find seller by id", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue({
        id: 1,
        name: "Seller",
      });

      const seller = await sellerService.findById(1);
      expect(seller).toEqual({ id: 1, name: "Seller" });
    });

    it("should throw error if seller not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue(null);

      await expect(sellerService.findById(1)).rejects.toThrow(
        "Seller not found"
      );
    });
  });

  // Test update method
  describe("update", () => {
    it("should update seller", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue({
        id: 1,
        name: "Seller",
      });

      sellerService.sellerRepo.update.mockResolvedValue({
        id: 1,
        name: "Updated Seller",
      });

      const updatedSeller = await sellerService.update(1, {
        name: "Updated Seller",
      });
      expect(updatedSeller).toEqual({ id: 1, name: "Updated Seller" });
    });

    it("should throw error if seller not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue(null);

      await expect(
        sellerService.update(1, { name: "Updated Seller" })
      ).rejects.toThrow("Seller not found");
    });

    it("should throw error if failed to update seller", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue({
        id: 1,
        name: "Seller",
      });

      sellerService.sellerRepo.update.mockResolvedValue(null);

      await expect(
        sellerService.update(1, { name: "Updated Seller" })
      ).rejects.toThrow("Failed to update seller");
    });
  });

  // Test delete method
  describe("delete", () => {
    it("should delete seller", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue({
        id: 1,
        name: "Seller",
      });

      sellerService.sellerRepo.delete.mockResolvedValue({
        id: 1,
        name: "Deleted Seller",
      });

      const deletedSeller = await sellerService.delete(1);
      expect(deletedSeller).toEqual({ id: 1, name: "Deleted Seller" });
    });

    it("should throw error if seller not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue(null);

      await expect(sellerService.delete(1)).rejects.toThrow("Seller not found");
    });

    it("should throw error if failed to delete seller", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue({
        id: 1,
        name: "Seller",
      });

      sellerService.sellerRepo.delete.mockResolvedValue(null);

      await expect(sellerService.delete(1)).rejects.toThrow(
        "Failed to delete seller"
      );
    });
  });

  // Test createItem method
  describe("createItem", () => {
    it("should create item", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue({
        id: 1,
        name: "Seller",
      });

      sellerService.sellerRepo.createItem.mockResolvedValue({
        id: 1,
        name: "Item",
      });

      const item = await sellerService.createItem(1, {}, Buffer.from("image"));
      expect(item).toEqual({ id: 1, name: "Item" });

      // Assertions for repository method calls
      expect(sellerService.sellerRepo.findById).toHaveBeenCalledWith(1);
      expect(sellerService.sellerRepo.createItem).toHaveBeenCalledWith(1, {
        images: "https://mock-url/image.jpg",
      });
    });

    it("should throw error if seller not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue(null);

      try {
        await sellerService.createItem(1, {}, Buffer.from("image"));
        throw new Error("createItem did not throw an error");
      } catch (error) {
        expect(error.message).toBe("Seller not found");
      }
    });

    it("should throw error if failed to create item", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue({
        id: 1,
        name: "Seller",
      });

      sellerService.sellerRepo.createItem.mockResolvedValue(null);

      try {
        await sellerService.createItem(1, {}, Buffer.from("image"));
        throw new Error("Failed to create item");
      } catch (error) {
        expect(error.message).toBe("Failed to create item");
      }
    });
  });

  // Test findItemById method
  describe("findItemById", () => {
    it("should find item by id", async () => {
      // Mock repository response
      sellerService.sellerRepo.findItemById.mockResolvedValue({
        id: 1,
        name: "Item",
      });

      const item = await sellerService.findItemById(1);
      expect(item).toEqual({ id: 1, name: "Item" });
    });

    it("should throw error if item not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findItemById.mockResolvedValue(null);

      await expect(sellerService.findItemById(1)).rejects.toThrow(
        "Item not found"
      );
    });
  });

  // Test findAllItems method
  describe("findAllItems", () => {
    it("should find all items", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue({
        id: 1,
        name: "Seller",
      });
      sellerService.sellerRepo.findAllItems.mockResolvedValue([
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ]);

      const items = await sellerService.findAllItems(1);
      expect(items).toEqual([
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ]);
    });

    it("should throw error if seller not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue(null);

      await expect(sellerService.findAllItems(1)).rejects.toThrow(
        "Seller not found"
      );
    });

    it("should throw error if items not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue({
        id: 1,
        name: "Seller",
      });
      sellerService.sellerRepo.findAllItems.mockResolvedValue(null);

      await expect(sellerService.findAllItems(1)).rejects.toThrow(
        "Items not found"
      );
    });
  });
});
