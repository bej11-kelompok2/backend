const SellerService = require("./seller.service");

// Mocking SellerRepository
jest.mock("../repository/seller.repository", () => {
  return jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createItem: jest.fn(),
    findItemById: jest.fn(),
    findAllItemsById: jest.fn(),
    findAllItems: jest.fn(),
    updateItem: jest.fn(),
    deleteItem: jest.fn(),
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

    it("should return 'Seller not found' if seller not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue(null);

      const result = await sellerService.findById(1);
      expect(result).toBe("Seller not found");
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

      sellerService.sellerRepo.update.mockResolvedValue([
        1,
        [
          {
            id: 1,
            name: "Updated Seller",
          },
        ],
      ]);

      const updatedSeller = await sellerService.update(1, {
        name: "Updated Seller",
      });
      expect(updatedSeller).toEqual({ id: 1, name: "Updated Seller" });
    });

    it("should return 'Seller not found' if seller not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue(null);

      const result = await sellerService.update(1, { name: "Updated Seller" });
      expect(result).toBe("Seller not found");
    });

    it("should throw error if failed to update seller", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue({
        id: 1,
        name: "Seller",
      });

      sellerService.sellerRepo.update.mockResolvedValue([0, []]);

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

      sellerService.sellerRepo.delete.mockResolvedValue(1);

      const deletedSeller = await sellerService.delete(1);
      expect(deletedSeller).toEqual(1);
    });

    it("should return 'Seller not found' if seller not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue(null);

      const result = await sellerService.delete(1);
      expect(result).toBe("Seller not found");
    });

    it("should throw error if failed to delete seller", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue({
        id: 1,
        name: "Seller",
      });

      sellerService.sellerRepo.delete.mockResolvedValue(0);

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

    it("should return 'Seller not found' if seller not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue(null);

      const result = await sellerService.createItem(
        1,
        {},
        Buffer.from("image")
      );
      expect(result).toBe("Seller not found");
    });

    it("should throw error if failed to create item", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue({
        id: 1,
        name: "Seller",
      });

      sellerService.sellerRepo.createItem.mockResolvedValue(null);

      await expect(
        sellerService.createItem(1, {}, Buffer.from("image"))
      ).rejects.toThrow("Failed to create item");
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

    it("should return 'Item not found' if item not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findItemById.mockResolvedValue(null);

      const result = await sellerService.findItemById(1);
      expect(result).toBe("Item not found");
    });
  });

  // Test findAllItemsById method
  describe("findAllItemsById", () => {
    it("should find all items by seller id", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue({
        id: 1,
        name: "Seller",
      });

      sellerService.sellerRepo.findAllItemsById.mockResolvedValue([
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ]);

      const items = await sellerService.findAllItemsById(1);
      expect(items).toEqual([
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ]);
    });

    it("should return 'Seller not found' if seller not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue(null);

      const result = await sellerService.findAllItemsById(1);
      expect(result).toBe("Seller not found");
    });

    it("should return 'Items not found' if items not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findById.mockResolvedValue({
        id: 1,
        name: "Seller",
      });

      sellerService.sellerRepo.findAllItemsById.mockResolvedValue([]);

      const result = await sellerService.findAllItemsById(1);
      expect(result).toBe("Items not found");
    });
  });

  // Test findAllItems method
  describe("findAllItems", () => {
    it("should find all items", async () => {
      // Mock repository response
      sellerService.sellerRepo.findAllItems.mockResolvedValue([
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ]);

      const items = await sellerService.findAllItems();
      expect(items).toEqual([
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ]);
    });

    it("should return 'Items not found' if no items found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findAllItems.mockResolvedValue([]);

      const result = await sellerService.findAllItems();
      expect(result).toBe("Items not found");
    });
  });

  // Test updateItem method
  describe("updateItem", () => {
    it("should update item", async () => {
      // Mock repository response
      sellerService.sellerRepo.findItemById.mockResolvedValue({
        id: 1,
        name: "Item",
        seller_id: 1,
      });

      sellerService.sellerRepo.updateItem.mockResolvedValue([
        1,
        [
          {
            id: 1,
            name: "Updated Item",
            seller_id: 1,
          },
        ],
      ]);

      const updatedItem = await sellerService.updateItem(
        1,
        { name: "Updated Item" },
        1
      );
      expect(updatedItem).toEqual({
        id: 1,
        name: "Updated Item",
        seller_id: 1,
      });
    });

    it("should return 'Item not found' if item not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findItemById.mockResolvedValue(null);

      const result = await sellerService.updateItem(
        1,
        { name: "Updated Item" },
        1
      );
      expect(result).toBe("Item not found");
    });

    it("should return 'Unauthorized, you are not the seller of this item' if not the seller", async () => {
      // Mock repository response
      sellerService.sellerRepo.findItemById.mockResolvedValue({
        id: 1,
        name: "Item",
        seller_id: 2,
      });

      const result = await sellerService.updateItem(
        1,
        { name: "Updated Item" },
        1
      );
      expect(result).toBe("Unauthorized, you are not the seller of this item");
    });

    it("should throw error if failed to update item", async () => {
      // Mock repository response
      sellerService.sellerRepo.findItemById.mockResolvedValue({
        id: 1,
        name: "Item",
        seller_id: 1,
      });

      sellerService.sellerRepo.updateItem.mockResolvedValue([0, []]);

      await expect(
        sellerService.updateItem(1, { name: "Updated Item" }, 1)
      ).rejects.toThrow("Failed to update item");
    });
  });

  // Test deleteItem method
  describe("deleteItem", () => {
    it("should delete item", async () => {
      // Mock repository response
      sellerService.sellerRepo.findItemById.mockResolvedValue({
        id: 1,
        name: "Item",
        seller_id: 1,
      });

      sellerService.sellerRepo.deleteItem.mockResolvedValue(1);

      const deletedItem = await sellerService.deleteItem(1, 1);
      expect(deletedItem).toBe("Success delete item");
    });

    it("should return 'Item not found' if item not found", async () => {
      // Mock repository response
      sellerService.sellerRepo.findItemById.mockResolvedValue(null);

      const result = await sellerService.deleteItem(1, 1);
      expect(result).toBe("Item not found");
    });

    it("should return 'Unauthorized, you are not the seller of this item' if not the seller", async () => {
      // Mock repository response
      sellerService.sellerRepo.findItemById.mockResolvedValue({
        id: 1,
        name: "Item",
        seller_id: 2,
      });

      const result = await sellerService.deleteItem(1, 1);
      expect(result).toBe("Unauthorized, you are not the seller of this item");
    });

    it("should throw error if failed to delete item", async () => {
      // Mock repository response
      sellerService.sellerRepo.findItemById.mockResolvedValue({
        id: 1,
        name: "Item",
        seller_id: 1,
      });

      sellerService.sellerRepo.deleteItem.mockResolvedValue(0);

      await expect(sellerService.deleteItem(1, 1)).rejects.toThrow(
        "Failed to delete item"
      );
    });
  });
});
